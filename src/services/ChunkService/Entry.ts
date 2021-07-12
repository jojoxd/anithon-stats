import {userLists_MediaListCollection_lists_entries} from "@anime-rss-filter/anilist";
import {SavedData} from "../../entity/SavedData";
import {ChunkService} from "../ChunkService";
import {Chunk} from "./Chunk";

/**
 * Entry Chunk Generation
 */
export class Entry
{
    public readonly data: userLists_MediaListCollection_lists_entries;

    public readonly savedData: SavedData['data']['value'];

    constructor(data: userLists_MediaListCollection_lists_entries, savedData: SavedData)
    {
        this.data = data;

        this.savedData = savedData.data[data.id!] ?? { mult: 1, order: 0, startAt: 0 };
    }

    protected sequel?: Entry;

    public setSequel(entry: Entry)
    {
        this.sequel = entry;
    }

    public getSequel(): Entry | null
    {
        return this.sequel ?? null;
    }

    get episodes(): number
    {
        return this.data.media!.episodes! - (this.savedData.startAt ?? 0);
    }

    get hasJoinedLastChunk()
    {
        return this.totalTime % ChunkService.CUTOFF < (ChunkService.LAST_CUTOFF);
    }

    get chunks(): number
    {

        if(this.hasJoinedLastChunk) {
            // Join Last Chunk
            return Math.max(Math.floor(this.totalTime / ChunkService.CUTOFF), 1);
        }

        return Math.ceil(this.totalTime / ChunkService.CUTOFF);
    }

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
