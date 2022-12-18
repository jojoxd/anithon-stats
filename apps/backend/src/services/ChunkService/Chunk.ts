import {Entry} from "./Entry";
import {MediaListStatus} from "@anistats/anilist";
import {Deprecated, Description, Enum, ForwardGroups, Property} from "@tsed/schema";
import {ChunkDto, ChunkStateEnum} from "@anistats/shared";
import {$log} from "@tsed/common";

/**
 * Data Class
 */
export class Chunk implements ChunkDto
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
		const progress = Math.min(Math.max(this.start, this.entry.data.progress ?? 0), this.end) - this.start;

		if (this.state === ChunkStateEnum.NotStarted) {
			return progress;
		}

		return progress + 1;
    }

    @Property()
	@Description("State of this chunk")
	@Enum(ChunkStateEnum)
    get state(): ChunkStateEnum
	{
		if (this.entry.isDropped) {
			if (this.entry.progress >= this.start && this.entry.progress <= this.end) {
				return ChunkStateEnum.Dropped;
			}
		}

		if (this.entry.progress >= this.end) {
			return ChunkStateEnum.Complete;
		}

		if (this.entry.progress >= this.start && this.entry.progress <= this.end) {
			return ChunkStateEnum.Started;
		}

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
