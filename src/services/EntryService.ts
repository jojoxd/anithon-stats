import {Inject, Service} from "@tsed/di";
import {Entry} from "./ChunkService/Entry";
import {AnilistService, MediaType} from "@anime-rss-filter/anilist";
import {$log} from "@tsed/common";
import {UserListContainer} from "./ListManager/UserListContainer";

@Service()
export class EntryService
{
    @Inject()
    protected anilist!: AnilistService;

    async getEntries(ctx: UserListContainer): Promise<Array<Entry>>
    {
        try {
            const data = await this.anilist.getUserList(ctx.userName, MediaType.ANIME, ctx.listName);
            const savedData = ctx.userList.savedData;

            const entries = data.entries!.map(entry => new Entry(entry!, savedData));

            // use for loop so we don't reference unknown entries
            for(let i = 0; i < entries.length; i++) {
                this.applySequels(entries[i]!, entries);
            }

            // reorder using savedData
            // @TODO: #1 Can savedData be undefined here? if so, make this safe
            entries.sort((a, b) => a.savedData.order > b.savedData.order ? 1 : -1);

            return entries;
        } catch(e) {
            $log.error(e);

            throw e;
        }
    }

    applySequels(entry: Entry, entries: Array<Entry>): void
    {
        if(!entry.getSequel()) {
            const sequels = entry.data.media!.relations!.edges!.filter(edge => edge!.relationType === 'SEQUEL').map(edge => edge!.node!);

            for (const sequel of sequels) {
                const sequelIndex = entries.findIndex((entry) => sequel.id === entry.data.media!.id!);

                if (sequelIndex >= 0) {
                    // remove index from entries, append to entry
                    let sequel = entries.splice(sequelIndex, 1)[0];

                    if(entry.sequel) {
                        // remove sequel from entry and maintain default entries
                        const _sequel = entry.unsetSequel()!;
                        entry.lockSequel();

                        entries.push(_sequel);
                        entries.push(sequel!);

                        $log.info(`[EntryService] Undid sequelizing for ${entry!.data.media!.title!.romaji!} (REASON: Entry has multiple sequels)`);
                    } else {
                        if(!entry.setSequel(sequel!)) {
                            // Sequels Locked, re-add sequel to entries
                            entries.push(sequel!);
                        }
                    }

                    $log.info('[EntryService] (%s).setSequel(%s)', entry!.data.media!.title!.romaji!, sequel!.data.media!.title!.romaji!);
                } else {
                    $log.info('[EntryService] no sequel found in entries for %s', entry!.data.media!.title!.romaji!);
                }
            }
        }

        // Recursively apply sequels
        let entrySequel = entry.getSequel();
        if(entrySequel)
            this.applySequels(entrySequel, entries);
    }
}