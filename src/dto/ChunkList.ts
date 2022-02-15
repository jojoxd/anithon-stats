import {Chunk} from "../services/ChunkService/Chunk";
import {CollectionOf, ForwardGroups, Property} from "@tsed/schema";
import {IChunkList} from "@anistats/shared";
import {MediaListStatus} from "@anime-rss-filter/anilist";

export class ChunkList implements IChunkList
{
    @Property()
    public user: IUserData;

    /**
     * Progress over time
     */
    @Property()
    get weightedProgress(): number
    {
        let totalTime = 0;
        let progressionTime = 0;

        for(const chunk of this.chunks) {
            const chunkTime = chunk.entry.totalTime / chunk.entry.episodes * (chunk.end - chunk.start);

            // @TODO: #1 Is it correct to not count dropped series as completion progress
            //        They should, probably. Otherwise a 100% complete list is impossible to get?
            //        But, it would depend on context
            // Don't count dropped series as completion progress
            if(chunk.entry.data.status === MediaListStatus.DROPPED)
                continue;

            totalTime += chunkTime;
            progressionTime += chunkTime / 100 * chunk.progress;
        }

        return Number((progressionTime / totalTime * 100).toFixed(1));
    }

    @CollectionOf(Chunk)
    @ForwardGroups()
    public chunks: Array<Chunk>;
}

interface IUserData
{

}
