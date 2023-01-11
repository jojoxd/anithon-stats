import {Inject, Service} from "@tsed/di";
import {SeriesRepository} from "../../repository/series/series.repository";
import {AnilistSeriesDomainService} from "../anilist/series/anilist-series.domain-service";
import {SeriesEntityFactory} from "../../factory/series/series-entity.factory";
import {SeriesEntity} from "../../entity/series/series.entity";

@Service()
export class SyncSeriesDomainService
{
	@Inject(SeriesRepository)
	protected seriesRepository!: SeriesRepository;

	@Inject()
	protected anilistSeriesService!: AnilistSeriesDomainService;

	public async syncSeries(anilistIds: Array<any>): Promise<void>
	{
		for(const anilistId of anilistIds) {
			await this.findOrCreateSeriesEntity(anilistId);
		}
	}

	protected async findOrCreateSeriesEntity(anilistId: any, depth = 0, excludeIds?: Array<any>): Promise<SeriesEntity>
	{
		let series = await this.seriesRepository.getFullSeriesByAnilistId(anilistId);

		const anilistSeriesView = await this.anilistSeriesService.getSeries(anilistId);
		const excludeIdsInner = excludeIds ?? [];

		if (!series) {
			series = SeriesEntityFactory.create(anilistSeriesView);
			console.log(`new(${series.anilistId})`);
			await this.seriesRepository.save(series);
		} else {
			console.log(`found(${series.anilistId})`);
		}

		if(depth >= 1) {
			return series;
		}
		depth += 1;

		excludeIdsInner.push(series.anilistId);

		for(const prequelId of anilistSeriesView.prequelIds) {
			if(excludeIdsInner.includes(prequelId)) {
				continue;
			}

			console.log(`(${series.id}).addPrequel(${prequelId})`);
			const prequel = await this.findOrCreateSeriesEntity(prequelId, depth, excludeIdsInner);
			series.addPrequel(prequel);

			await this.seriesRepository.save(series, { reload: true });
		}

		for(const sequelId of anilistSeriesView.sequelIds) {
			if (excludeIdsInner.includes(sequelId)) {
				continue;
			}

			console.log(`(${series.id}).addSequel(${sequelId})`);
			const sequel = await this.findOrCreateSeriesEntity(sequelId, depth, excludeIdsInner);
			series.addSequel(sequel);

			await this.seriesRepository.save(series, { reload: true });
		}

		// @TODO: Remove id's not included in anilistSeriesView

		series.synchronizedAt = new Date();

		await this.seriesRepository.save(series, { reload: true });

		return series;
	}
}
