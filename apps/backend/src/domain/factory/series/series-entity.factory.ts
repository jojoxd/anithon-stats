import {SeriesEntity} from "../../entity/series/series.entity";
import {AnilistSeriesView} from "../../view/anilist/series/anilist-series.view";

export class SeriesEntityFactory
{
	static create(anilistSeriesView: AnilistSeriesView): SeriesEntity
	{
		const seriesEntity = new SeriesEntity();

		seriesEntity.anilistId = anilistSeriesView.id;

		seriesEntity.title = anilistSeriesView.title;
		seriesEntity.description = anilistSeriesView.description ?? undefined;

		seriesEntity.coverImage = anilistSeriesView.coverImage;

		seriesEntity.episodes = anilistSeriesView.episodeCount ?? undefined; // @TODO: Should never be null, ever
		seriesEntity.duration = anilistSeriesView.duration! ?? 1; // @TODO: Should not be null, ever

		seriesEntity.createdAt = new Date();

		return seriesEntity;
	}
}
