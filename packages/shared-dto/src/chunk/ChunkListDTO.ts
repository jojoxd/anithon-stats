import {IChunkList} from "@anistats/shared";
import {CollectionOf, ForwardGroups, Ignore, Property} from "@tsed/schema";
import {ChunkDTO} from "./ChunkDTO";

export class ChunkListDTO implements IChunkList
{
	@Ignore()
	protected backingData: IChunkList;

	constructor(chunkList: IChunkList)
	{
		this.backingData = chunkList;
	}

	@Property()
	@CollectionOf(ChunkDTO)
	@ForwardGroups()
	public get chunks(): Array<ChunkDTO>
	{
		return this.backingData.chunks.map(chunk => new ChunkDTO(chunk));
	}

	@Property()
	public get weightedProgress(): number
	{
		return this.backingData.weightedProgress;
	}
}
