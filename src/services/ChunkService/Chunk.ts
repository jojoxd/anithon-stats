import {Entry} from "./Entry";
import {MediaListStatus} from "@anime-rss-filter/anilist";

/**
 * Data Class
 */
export class Chunk
{
    public readonly entry: Entry;

    public readonly start: number;

    public readonly end: number;

    public readonly isJoined: boolean;

    constructor(entry: Entry, start: number, end: number, isJoined: boolean = false)
    {
        this.entry = entry;

        this.start = start;
        this.end = end;
        this.isJoined = isJoined;

        console.log(`New Chunk - ${this.entry.data.media!.title!.romaji!} ${this.start} - ${this.end}`);
    }

    get isComplete(): boolean
    {
        return this.entry.data.progress! >= this.end || this.entry.data.status === MediaListStatus.DROPPED;
    }

    get progress(): number
    {
        try {
            const unclamped = (this.entry.data.progress! - this.start + 1) / (this.end - this.start + 1) * 100
            return Math.max(0, Math.min(100, unclamped));
        } catch { // might be a divide by zero
            return this.isComplete ? 100 : 0;
        }
    }
}
