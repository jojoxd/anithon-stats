import {IChunk, IEntry} from "@anistats/shared";
import {ForwardGroups, Ignore, Property} from "@tsed/schema";


export class ChunkDTO implements IChunk
{
	@Ignore()
	protected backingData: IChunk;

	constructor(chunk: IChunk)
	{
		this.backingData = chunk;
	}

	@Property()
	public get start(): number
	{
		return this.backingData.start;
	}

	@Property()
	public get end(): number
	{
		return this.backingData.end;
	}

	@Property()
	@ForwardGroups()
	public get entry(): IEntry
	{
		return this.backingData.entry;
	}

	@Property()
	public get isComplete(): boolean
	{
		return this.backingData.isComplete;
	}

	@Property()
	public get isJoined(): boolean
	{
		return this.backingData.isJoined;
	}

	@Property()
	public get progress(): number
	{
		return this.backingData.progress;
	}
}
