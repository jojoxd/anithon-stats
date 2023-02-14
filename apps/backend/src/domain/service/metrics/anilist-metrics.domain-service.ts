import {Inject, Injectable, ProviderScope} from "@tsed/di";
import {AfterInit} from "@tsed/common";
import { MetricService } from "@jojoxd/tsed-util/prometheus";
import { Histogram } from "prom-client";

@Injectable({ scope: ProviderScope.SINGLETON, })
export class AnilistMetricsDomainService implements AfterInit
{
	@Inject()
	protected readonly metricService!: MetricService;

	protected anilistCallHistogram?: Histogram;

	public startHistogram(queryName: string, queryType: 'QUERY' | 'MUTATION'): (error?: string) => void
	{
		if (!this.anilistCallHistogram) {
			return () => { /* no-op */ };
		}

		this.anilistCallHistogram.observe(1);

		const labels = {
			queryName,
			queryType,
		};

		const endTimer = this.anilistCallHistogram?.startTimer(labels);

		return (error?: string) => {
			endTimer({
				...labels,

				error: error ?? "null",
			});
		};
	}

	public $afterInit(): void
	{
		this.anilistCallHistogram = this.metricService.createHistogram({
			name: 'anilist_call',
			help: 'anilist calls',
			labelNames: ['queryName', 'queryType', 'error'],
		});
	}
}