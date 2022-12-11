import {Entry} from "./Entry";
import {MediaListStatus} from "@anistats/anilist";
import {Deprecated, Description, Enum, ForwardGroups, Property} from "@tsed/schema";
import {IChunk} from "@anistats/shared";
import { $log } from "@tsed/common";
import {ChunkStateEnum} from "@anistats/shared";

/**
 * Data Class
 */
export class Chunk implements IChunk
{
    @Property()
    @ForwardGroups()
	@Description("The entry that this chunk is a part of")
    public readonly entry: Entry;

    @Property()
	@Description("The starting episode of this chunk")
    public readonly start: number;

    @Property()
	@Description("The last episode of this chunk")
    public readonly end: number;

    @Property()
	@Description("Is this chunk joined?")
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
	@Deprecated()
	@Description("Is this chunk complete? (Deprecated, use .state instead)")
    get isComplete(): boolean
    {
        return this.entry.data.progress! >= this.end || this.entry.data.status === MediaListStatus.DROPPED;
    }

    @Property()
	@Description("Progress (in Episodes) of this chunk")
    get progress(): number
    {
    	return Math.max(0, this.entry.data.progress! - this.start + 1);
    }

    @Property()
	@Description("State of this chunk")
	@Enum(ChunkStateEnum)
    get state(): ChunkStateEnum
	{
		return ChunkStateEnum.NotStarted;
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
