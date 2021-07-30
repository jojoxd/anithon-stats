import {Property} from "@tsed/schema";
import {
    userLists_MediaListCollection_lists_entries
} from "@anime-rss-filter/anilist";
import {ISeriesData, ISeriesTitle} from "@anistats/shared";

export class SeriesData implements ISeriesData
{
    @Property()
    public readonly id: number;

    @Property()
    public readonly title: ISeriesTitle;

    @Property()
    public readonly coverImage: string;

    @Property()
    public readonly duration: number;

    @Property()
    public readonly notes: string | null;

    constructor(data: userLists_MediaListCollection_lists_entries)
    {
        this.id = data.media!.id!;

        this.title = {
            romaji: data.media!.title!.romaji!,
            english: data.media!.title!.english!,
            native: data.media!.title!.native!,
        };

        this.coverImage = data.media!.coverImage!.large!;

        this.duration = data.media!.duration!;

        this.notes = data.notes;
    }
}
