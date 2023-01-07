import {SeriesId} from "./series-ref";
import {SeriesTitleDto} from "./series-title.dto";

export interface SeriesDto
{
    id: SeriesId;

    title: SeriesTitleDto;

    coverImage: string;

    duration: number;

    episodes: number | null;

    description: string | null;
}
