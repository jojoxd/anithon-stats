import {Service} from "@tsed/di";
import {SeriesDto, SeriesListDto} from "@anistats/shared";
import {ListEntity} from "../entity/list/list.entity";
import {SeriesEntity} from "../entity/series/series.entity";
import {NotImplemented} from "@tsed/exceptions";

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
		throw new NotImplemented("Not implemented");
	}

	public getTotalDuration(series: SeriesEntity): number | null
	{
		if (series.episodes === null) {
			return null;
		}

		return series.duration * series.episodes;
	}
}
