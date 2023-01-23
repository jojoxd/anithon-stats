import {Command, CommandProvider, QuestionOptions} from "@tsed/cli-core";
import {SyncSeriesDomainService} from "../domain/service";
import { Inject } from "@tsed/di";
import {InjectRepository} from "@jojoxd/tsed-util/mikro-orm";
import {SeriesEntity} from "../domain/entity/series/series.entity";
import {SeriesRepository} from "../domain/repository/series/series.repository";

@Command({
	name: "sync-database",
	description: "Sync Database Entries",
	args: {},
	options: {},
	allowUnknownOption: false,
})
export class SyncDatabaseCommand implements CommandProvider
{
	@Inject()
	protected readonly syncSeriesService!: SyncSeriesDomainService;

	@InjectRepository(SeriesEntity)
	protected readonly seriesRepository!: SeriesRepository;

	$exec(ctx: any): any
	{
		return [{
			title: "Sync database",
			task: async () => {
				const series = await this.seriesRepository.findAll({
					limit: 50,
					orderBy: {
						synchronizedAt: 'ASC',
					}
				});

				await this.syncSeriesService.syncSeries(series.map(series => series.anilistId));
			}
		}]
	}
}