interface User {

}

type EntryId = number;

interface Series {

}

type SavedData = Record<string, any>;

enum EntryStatus {
    Dropped,
}

interface EntryRef
{
    ref: EntryId;
}

interface Entry
{
    id: EntryId;

    series: Series;

    episodes: number;

    hasJoinedLastChunk: boolean;

    stats: {
        chunks: number;
        time: number;
    };

    status: EntryStatus;

    savedData: SavedData;

    sequel: EntryRef;
}

interface Chunk
{
    entry: EntryRef;

    start: number;

    end: number;

    isJoined: boolean;

    state: ChunkStateEnum;

    progress: number;
}

export interface TestListDto
{
    user: User;

    list: {
        title: string;
        description: string;

        stats: {
            time: number;
        };
    };

    entries: Array<Entry>;

    chunks: Array<Chunk>;
}
