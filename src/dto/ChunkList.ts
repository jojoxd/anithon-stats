import {Chunk} from "../services/ChunkService/Chunk";
import {CollectionOf, ForwardGroups, Property} from "@tsed/schema";
import {IChunkList} from "@anistats/shared";

export class ChunkList implements IChunkList
{
    @Property()
    public user: IUserData;

    @Property()
    get weightedProgress(): number
    {
        let episodeCount = 0;
        let progress = 0;

        for(const chunk of this.chunks) {
            episodeCount += chunk.end - chunk.start;
            progress += chunk.progress;
        }

        return Number((progress / episodeCount).toFixed(1));
    }

    @CollectionOf(Chunk)
    @ForwardGroups()
    public chunks: Array<Chunk>;
}

interface IUserData
{

}
