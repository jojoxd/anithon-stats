import {Inject, Service} from "@tsed/di";
import {IEntry} from "@anistats/shared";
import {Entry} from "./ChunkService/Entry";
import {AnilistService, MediaType} from "@anime-rss-filter/anilist";
import {SavedDataRepository} from "../entity/SavedDataRepository";
import {$log} from "@tsed/common";

@Service()
export class EntryService
{
    @Inject()
    protected anilist: AnilistService;

    @Inject()
    protected savedDataRepository: SavedDataRepository;

    async getEntries(userName: string, listName: string): Promise<Array<Entry>>
    {
        try {
            const data = await this.anilist.getUserList(userName, MediaType.ANIME, listName);
            const savedData = await this.savedDataRepository.findOrCreate(listName);

            const entries = data.entries!.map(entry => new Entry(entry!, savedData));

            // use for loop so we don't reference unknown entries
            for(let i = 0; i < entries.length; i++) {
                this.applySequels(entries[i], entries);
            }

            // reorder using savedData
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
                    entry.setSequel(sequel);

                    $log.info('(%s).setSequel(%s)', entry?.data.media!.title!.romaji!, sequel.data.media!.title!.romaji!);
                } else {
                    $log.info('no sequel found in entries for %s', entry.data.media!.title!.romaji!);
                }
            }
        }

        // Recursively apply sequels
        let entrySequel = entry.getSequel();
        if(entrySequel)
            this.applySequels(entrySequel, entries);
    }
}