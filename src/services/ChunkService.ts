import {Service} from "@tsed/di";
import {MediaFormat} from "@anime-rss-filter/anilist";
import {$log} from "@tsed/common";
import {Chunk} from "./ChunkService/Chunk";
import {Entry} from "./ChunkService/Entry";
import {StackManager} from "./ChunkService/StackManager";
import {ChunkList} from "../dto/ChunkList";

/**
 * Chunk Service
 */
@Service()
export class ChunkService
{
    /**
     * The Maximum length a Chunk can be
     */
    static CUTOFF = 2.25 * 60;

    /**
     * If the last Chunk of an entry is less than LAST_CUTOFF minutes, merge the last 2 chunks together
     *
     * Using this, the last chunk can be as large as CUTOFF + LAST_CUTOFF
     */
    static LAST_CUTOFF = 0.75 * 60;

    async chunkize(entries: Array<Entry>): Promise<ChunkList>
    {
        const list = new ChunkList();

        list.user = {};
        list.chunks = Array.from(this.generate(entries));

        return list;
    }

    *generate(entries: Array<Entry>): Generator<Chunk>
    {
        const chunks = [];
        for(let i = 0; i < entries.length; i++) {
            chunks.push(Array.from(entries[i].next()));
        }

        $log.info('chunks', chunks.map(ch => `[\n\t${ch.map(c => `"${c.entry.data.media!.title!.romaji!}" ${c.start} - ${c.end}`).join("],\n\t[")}]`).join("\n"));

        const episodes = chunks.filter(chunk => {
            return chunk[0]!.entry.data!.media!.format! !== MediaFormat.MOVIE && chunk[0]!.entry.chunks > 1;
        });

        // Movies and small stuff (only single-chunked)
        const movies = chunks.filter(chunk => {
            return chunk[0]!.entry.data!.media!.format! === MediaFormat.MOVIE || chunk[0]!.entry.chunks === 1;
        });

        let episodeStack = new StackManager(episodes, 3);
        let moviesStack = new StackManager(movies, movies.length);

        let episodeGenerator = episodeStack.next();
        let movieGenerator = moviesStack.next();

        let movieInterval = Math.floor(episodeStack.totalSize / moviesStack.totalSize + 1);

        let i = 0;
        while(!episodeStack.done || !moviesStack.done) {
            // $log.debug('i = %s, movieInterval = %s, epi# = %s, mov# = %s', i, movieInterval, episodes.length, movies.length);

            $log.debug('emit episodeChunk');
            let episodeChunk = episodeGenerator.next().value;
            if(episodeChunk)
                yield episodeChunk;

            if(i % movieInterval === 0) {
                $log.debug('emit movieChunk');
                let movieChunk = movieGenerator.next().value;

                if(movieChunk)
                    yield movieChunk;
            }

            i++;
        }
    }
}
