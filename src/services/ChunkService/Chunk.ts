import {Entry} from "./Entry";
import {MediaListStatus} from "@anime-rss-filter/anilist";
import {ForwardGroups, Property} from "@tsed/schema";
import {IChunk} from "@anistats/shared";
import { $log } from "@tsed/common";

/**
 * Data Class
 */
export class Chunk implements IChunk
{
    @Property()
    @ForwardGroups()
    public readonly entry: Entry;

    @Property()
    public readonly start: number;

    @Property()
    public readonly end: number;

    @Property()
    public readonly isJoined: boolean;

    constructor(entry: Entry, start: number, end: number, isJoined: boolean = false)
    {
        this.entry = entry;

        this.start = start;
        this.end = end;
        this.isJoined = isJoined;

        $log.debug(`New Chunk - ${this.entry.data.media!.title!.romaji!} ${this.start} - ${this.end}`);
    }

    @Property()
    get isComplete(): boolean
    {
        return this.entry.data.progress! >= this.end || this.entry.data.status === MediaListStatus.DROPPED;
    }

    @Property()
    get progress(): number
    {
        try {
            const unclamped = (this.entry.data.progress! - this.start + 1) / (this.end - this.start + 1) * 100
            return Math.max(0, Math.min(100, unclamped));
        } catch { // might be a divide by zero
            return this.isComplete ? 100 : 0;
        }
    }

    /**
     * Merges this chunk with another chunk
     * (Creates a new Chunk)
     */
    merge(chunk: Chunk): Chunk
    {
        if(chunk.entry !== this.entry)
            throw new Error("Entries are not the same, cannot merge");

        return new Chunk(
            chunk.entry,
            Math.min(this.start, chunk.start),
            Math.max(this.end, chunk.end),
            true
        );
    }
}
