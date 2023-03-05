import {SeriesEntity} from "../../entity/series/series.entity";
import {MediaFragmentView} from "../../view/anilist/media/media-fragment.view";

export class SeriesEntityFactory
{
	static create(mediaFragmentView: MediaFragmentView): SeriesEntity
	{
		const seriesEntity = new SeriesEntity();

		seriesEntity.anilistId = mediaFragmentView.id;

		seriesEntity.title = mediaFragmentView.title;
		seriesEntity.description = mediaFragmentView.description ?? undefined;

		seriesEntity.coverImage = mediaFragmentView.coverImage;

		// @TODO: Should never be null, ever
		seriesEntity.episodes = mediaFragmentView.episodes ?? undefined;

		// @TODO: Should not be null, ever
		seriesEntity.duration = mediaFragmentView.duration! ?? 1;

		seriesEntity.createdAt = new Date();

		return seriesEntity;
	}
}
