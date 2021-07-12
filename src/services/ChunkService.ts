import {Service} from "@tsed/di";
import {
    MediaFormat,
    userLists_MediaListCollection_lists
} from "@anime-rss-filter/anilist";
import {SavedData} from "../entity/SavedData";
import {$log} from "@tsed/common";
import {Chunk} from "./ChunkService/Chunk";
import {Entry} from "./ChunkService/Entry";
import {StackManager} from "./ChunkService/StackManager";

/**
 * Chunk Service
 */
@Service()
export class ChunkService
{
    async chunkize(data: userLists_MediaListCollection_lists, savedData: SavedData): Promise<Array<Chunk>>
    {
        const entries = data.entries!.map(entry => new Entry(entry!, savedData));

        // use for loop so we don't reference unknown entities
        for(let i = 0; i < entries.length; i++) {
            this.applySequels(entries[i], entries);
        }

        // reorder using savedData
        entries.sort((a, b) => a.savedData.order > b.savedData.order ? 1 : -1);

        return Array.from(this.generate(entries));
    }

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

    applySequels(entry: Entry, entries: Array<Entry>)
    {
        if(!entry.getSequel()) {
            const sequels = entry.data.media!.relations!.edges!.filter(edge => edge!.relationType === 'SEQUEL').map(edge => edge!.node!);

            for (const sequel of sequels) {
                const sequelIndex = entries.findIndex((entry) => sequel.id === entry.data.media!.id!);

                if (sequelIndex >= 0) {
                    // remove index from entries, append to entry
                    let sequel = entries.splice(sequelIndex, 1)[0];
                    entry.setSequel(sequel);

                    $log.info('(%s).setSequel(%s)', entry?.data.media!.title!.romaji!, sequel.data.media!.title!.romaji!);
                } else {
                    $log.info('no sequel found in entries for %s', entry.data.media!.title!.romaji!);
                }
            }
        }

        // Recursively apply sequels
        let entrySequel = entry.getSequel();
        if(entrySequel)
            this.applySequels(entrySequel, entries);
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
