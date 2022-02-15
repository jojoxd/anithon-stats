import {
    userLists_MediaListCollection_lists_entries
} from "@anime-rss-filter/anilist";
import {SavedData} from "../../entity/SavedData";
import {ChunkService} from "../ChunkService";
import {Chunk} from "./Chunk";
import {ForwardGroups, Groups, Property} from "@tsed/schema";
import {SeriesData} from "./SeriesData";
import {IEntry, ISavedData} from "@anistats/shared";

/**
 * Entry Chunk Generation
 */
export class Entry implements IEntry
{
    public readonly data: userLists_MediaListCollection_lists_entries;

    @Property()
    public readonly savedData: ISavedData;

    constructor(data: userLists_MediaListCollection_lists_entries, savedData: SavedData)
    {
        this.data = data;

        this.savedData = savedData.data[data.id!] ?? { mult: 1, order: 0, startAt: 0, split: undefined };
    }

    @Property()
    get series(): SeriesData
    {
        return new SeriesData(this.data);
    }

    @Property()
    get id()
    {
        return this.data.id;
    }

    protected _sequel?: Entry;

    @Property()
    @Groups('deep-entry')
    @ForwardGroups()
    get sequel(): Entry | undefined
    {
        return this._sequel;
    }

    protected _sequelLocked: boolean;

    public setSequel(entry: Entry): boolean
    {
        if(this._sequelLocked)
            return false;

        this._sequel = entry;

        return true;
    }

    public unsetSequel(): Entry | undefined
    {
        const sequel = this._sequel;
        this._sequel = undefined;

        return sequel;
    }

    public lockSequel()
    {
        this._sequelLocked = true;
    }

    public getSequel(): Entry | null
    {
        return this.sequel ?? null;
    }

    @Property()
    get episodes(): number
    {
        return this.data.media!.episodes! - (this.savedData.startAt ?? 0);
    }

    @Property()
    get hasJoinedLastChunk()
    {
        if(this.savedData.split) {
            return Math.floor(this.episodes / this.savedData.split) <= 1;
        }

        return this.totalTime % ChunkService.CUTOFF < (ChunkService.LAST_CUTOFF);
    }

    @Property()
    get chunks(): number
    {
        // @TODO: Check if this works correctly
        if(this.savedData.split) {
            // Ensure we are into range 1 - episodeCount
            return Math.min(Math.max(this.savedData.split, 1), this.episodes);
        }

        if(this.hasJoinedLastChunk) {
            // Join Last Chunk
            return Math.max(Math.floor(this.totalTime / ChunkService.CUTOFF), 1);
        }

        return Math.ceil(this.totalTime / ChunkService.CUTOFF);
    }

    @Property()
    get totalTime(): number
    {
        return this.data.media!.duration! * this.episodes * this.savedData.mult;
    }

    *next(): Generator<Chunk>
    {
        let lastEnd = Number(this.savedData.startAt ?? 0);

        if(this.chunks > 1) {
            for(let chunkNumber = 0; chunkNumber < this.chunks; chunkNumber++) {
                let episodes = Math.floor(this.episodes / this.chunks);

                if(chunkNumber === (this.chunks - 1) && this.hasJoinedLastChunk) {
                    yield new Chunk(this, lastEnd + 1, this.episodes, true);
                } else {
                    yield new Chunk(this, lastEnd + 1, lastEnd += episodes);
                }
            }
        } else {
            yield new Chunk(this, lastEnd + 1, lastEnd + this.episodes);
        }

        if(this.sequel) {
            yield* this.sequel.next();
        }
    }
}
