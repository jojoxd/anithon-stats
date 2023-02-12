import { Scheduler, Schedule } from "@jojoxd/tsed-util/scheduler";
import { InjectRepository } from "@jojoxd/tsed-util/mikro-orm";
import { SeriesRepository } from "../../domain/repository/series/series.repository";
import { SeriesEntity } from "../../domain/entity/series/series.entity";
import { Inject } from "@tsed/di";
import { SyncSeriesDomainService } from "../../domain/service/sync/sync-series.domain-service";
import { $log } from "@tsed/common";
import {MetricService} from "@jojoxd/tsed-util/prometheus";
import { Counter } from "prom-client";

@Scheduler({ "namespace": "sync", })
export class SyncDatabaseScheduler
{
	@Inject()
	protected readonly syncSeriesService!: SyncSeriesDomainService;

	@InjectRepository(SeriesEntity)
	protected seriesRepository!: SeriesRepository;

	protected readonly jobCounter!: Counter;

	constructor(@Inject() metricService: MetricService)
	{
		this.jobCounter = metricService.createCounter({
			name: 'sync_jobs_run',
			help: 'How many times a sync job has run'
		});
	}

	@Schedule({ name: "Sync Series", rule: "*/2 * * * *" })
	protected async syncDatabaseJob()
	{
		this.jobCounter.inc();

		$log.info("Syncing series");

		const series = await this.seriesRepository.findSyncableSeries(50);

		if (series.length === 0) {
			$log.info("No series to sync");
			return;
		}

		$log.info("Sync series: ", series.map(s => s.anilistId).join(','));

		await this.syncSeriesService.syncSeries(series.map(series => series.anilistId));

		await this.seriesRepository.flush();
	}
}