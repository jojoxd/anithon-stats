import { Scheduler, Schedule } from "@jojoxd/tsed-util/scheduler";
import { InjectRepository } from "@jojoxd/tsed-util/mikro-orm";
import { SeriesRepository } from "../../domain/repository/series/series.repository";
import { SeriesEntity } from "../../domain/entity/series/series.entity";
import { Inject } from "@tsed/di";
import { SyncSeriesDomainService } from "../../domain/service/sync/sync-series.domain-service";
import { $log } from "@tsed/common";

@Scheduler({ "namespace": "sync", })
export class SyncDatabaseScheduler
{
	@Inject()
	protected readonly syncSeriesService!: SyncSeriesDomainService;

	@InjectRepository(SeriesEntity)
	protected seriesRepository!: SeriesRepository;

	@Schedule({ name: "Sync Series", rule: "*/2 * * * *" })
	protected async syncDatabaseJob()
	{
		$log.info("Syncing series");

		const series = await this.seriesRepository.findAll({
			limit: 50,
			orderBy: {
				synchronizedAt: 'ASC',
			},
		});

		console.log(series.map(s => s.anilistId).join(','));

		await this.syncSeriesService.syncSeries(series.map(series => series.anilistId));

		await this.seriesRepository.flush();
	}
}