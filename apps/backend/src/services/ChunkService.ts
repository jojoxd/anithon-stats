import {Service} from "@tsed/di";
import {MediaFormat} from "@anistats/anilist";
import {$log} from "@tsed/common";
import {Chunk} from "./ChunkService/Chunk";
import {Entry} from "./ChunkService/Entry";
import {StackManager} from "./ChunkService/StackManager";
import {ChunkList} from "../dto/ChunkList";
import {UserListContainer} from "./ListManager/UserListContainer";

/**
 * Chunk Service
 */
@Service()
export class ChunkService
{
    async chunkize(ctx: UserListContainer): Promise<ChunkList>
    {
        const list = new ChunkList();

        list.user = {};
        const chunks = Array.from(this.generate(await ctx.toEntries()));

        list.chunks = chunks;

        if(ctx.userList.allowChunkMerge) {
            let canMerge = true;
            let _chunks = chunks;
            while(canMerge) {
                let merged = this.merge(_chunks);

                _chunks = merged.chunks;
                canMerge = merged.merges;
            }

            list.chunks = _chunks;
        }

        return list;
    }

    merge(chunks: Array<Chunk>): { chunks: Array<Chunk>, merges: boolean }
    {
        const newChunks: Array<Chunk> = [];
        let merges = false;

        for(let idx = 0; idx < chunks.length; idx++) {
            if(chunks[idx]!.entry.id === chunks[idx + 1]?.entry.id) {

                // Don't merge if split is on / autosplit is off
                if(typeof chunks[idx]!.entry.savedData.split !== "undefined") {
                    newChunks.push(chunks[idx]!);
                    continue;
                }

                try {
                    const mergedChunk = chunks[idx]!.merge(chunks[idx + 1]!);

                    $log.info(`[ChunkService] Merged Chunks ${idx} & ${idx + 1}`, mergedChunk.entry.series.title.romaji);

                    newChunks.push(mergedChunk);
                    merges = true;

                    idx += 1; // skip next Chunk as it's been merged together
                } catch(e) {
                    $log.warn(e);

                    newChunks.push(chunks[idx]!);
                }

                continue;
            }

            newChunks.push(chunks[idx]!);
        }

        return {
            chunks: newChunks,
            merges
        }
    }

    *generate(entries: Array<Entry>): Generator<Chunk>
    {
        const chunks = [];
        for(let i = 0; i < entries.length; i++) {
            chunks.push(Array.from(entries[i]!.next()));
        }

        $log.info('[ChunkService] chunks', chunks.map(ch => `[\n\t${ch.map(c => `"${c.entry.data.media!.title!.romaji!}" ${c.start} - ${c.end}`).join("],\n\t[")}]`).join("\n"));

        const episodes = chunks.filter(chunk => {
			$log.info(`[ChunkService] ${chunk[0]!.entry.data!.media!.title!.romaji!}: mediaFormat = ${chunk[0]!.entry.data!.media!.format}, chunks = ${chunk[0]!.entry.chunks}`);
            return chunk[0]!.entry.data!.media!.format! !== MediaFormat.MOVIE && chunk[0]!.entry.chunks > 1;
        });

        // Movies and small stuff (only single-chunked)
        const movies = chunks.filter(chunk => {
            return chunk[0]!.entry.data!.media!.format! === MediaFormat.MOVIE || chunk[0]!.entry.chunks === 1;
        });

        $log.info("[ChunkService] Episodes & Movies", {episodes, movies});

        let episodeStack = new StackManager(episodes, 3);
        let moviesStack = new StackManager(movies, movies.length);

        let episodeGenerator = episodeStack.next();
        let movieGenerator = moviesStack.next();

        let movieInterval = Math.floor(episodeStack.totalSize / moviesStack.totalSize + 1);

        let i = 0;
        while(!episodeStack.done || !moviesStack.done) {
            $log.info('[ChunkService] i = %s, movieInterval = %s, epi# = %s, mov# = %s', i, movieInterval, episodes.length, movies.length);

            $log.info('[ChunkService] emit episodeChunk');
            let episodeChunk = episodeGenerator.next().value;
            if(episodeChunk)
                yield episodeChunk;

            if(i % movieInterval === 0) {
                $log.info('[ChunkService] emit movieChunk');
                let movieChunk = movieGenerator.next().value;

                if(movieChunk)
                    yield movieChunk;
            }

            i++;
        }
    }
}
