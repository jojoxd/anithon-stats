import {Service} from "@tsed/di";
import {SeriesDto, SeriesListDto} from "@anistats/shared";
import { ListEntity } from "../entity/list/list.entity";
import { SeriesEntity } from "../entity/series/series.entity";

@Service()
export class SeriesDomainService
{
	public async getSeriesList(list: ListEntity): Promise<SeriesListDto>
	{
		return {
			items: await this.getSeries(list),
		}
	}

	public async getSeries(list: ListEntity): Promise<Array<SeriesDto>>
	{
		await list.entries.init({ populate: true });

		return list.entries.getItems().map(entry => {
			return this.mapToDto(entry.series.getEntity());
		});
	}

	public getTotalDuration(series: SeriesEntity): number | null
	{
		if (typeof series.episodes === 'undefined') {
			return null;
		}

		return series.duration * series.episodes;
	}

	public mapToDto(seriesEntity: SeriesEntity): SeriesDto
	{
		return {
			id: seriesEntity.id,
			title: seriesEntity.title,
			description: seriesEntity.description ?? null,

			coverImage: seriesEntity.coverImage!,

			duration: seriesEntity.duration,
			episodes: seriesEntity.episodes ?? null,
		}
	}
}
