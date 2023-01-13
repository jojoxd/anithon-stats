import {Inject, Service} from "@tsed/di";
import {SeriesRepository} from "../../repository/series/series.repository";
import {AnilistSeriesDomainService} from "../anilist/series/anilist-series.domain-service";
import {SeriesEntityFactory} from "../../factory/series/series-entity.factory";
import {SeriesEntity} from "../../entity/series/series.entity";
import {InjectRepository} from "../../../ext/mikro-orm/inject-repository.decorator";
import {DateTime, Duration} from "luxon";
import {AnilistSeriesView} from "../../view/anilist/series/anilist-series.view";

@Service()
export class SyncSeriesDomainService
{
	@InjectRepository(SeriesEntity)
	protected seriesRepository!: SeriesRepository;

	@Inject()
	protected anilistSeriesService!: AnilistSeriesDomainService;

	public async syncSeries(anilistIds: Array<any>): Promise<void>
	{
		for(const anilistId of anilistIds) {
			await this.findOrCreateSeriesEntity(anilistId);
		}
	}

	public async findOrCreateSeriesEntity(anilistId: any, depth = 0, excludeIds?: Array<any>, anilistSeriesView?: AnilistSeriesView): Promise<SeriesEntity>
	{
		let series = await this.seriesRepository.findOne({ anilistId });

		if (series && !this.shouldSynchronize(series)) {
			return series;
		}

		anilistSeriesView ??= await this.anilistSeriesService.getSeries(anilistId);
		const excludeIdsInner = excludeIds ?? [];

		if (!series) {
			series = SeriesEntityFactory.create(anilistSeriesView);
			// console.log(`new(${series.anilistId})`);
			await this.seriesRepository.persistAndFlush(series);
		} else {
			// console.log(`found(${series.anilistId})`);
		}

		if(depth >= 1) {
			return series;
		}
		depth += 1;

		excludeIdsInner.push(series.anilistId);

		// Initialize connections, if needed
		await series.prequels.init({ populate: true, });
		await series.sequels.init({ populate: true, });

		for(const prequelId of anilistSeriesView.prequelIds) {
			if(excludeIdsInner.includes(prequelId)) {
				continue;
			}

			// console.log(`(${series.id}).addPrequel(${prequelId})`);
			const prequel = await this.findOrCreateSeriesEntity(prequelId, depth, excludeIdsInner);
			series.prequels.add(prequel);

			await this.seriesRepository.persist(series);
		}

		for(const sequelId of anilistSeriesView.sequelIds) {
			if (excludeIdsInner.includes(sequelId)) {
				continue;
			}

			// console.log(`(${series.id}).addSequel(${sequelId})`);
			const sequel = await this.findOrCreateSeriesEntity(sequelId, depth, excludeIdsInner);
			series.sequels.add(sequel);

			await this.seriesRepository.persist(series);
		}

		// @TODO: Remove id's not included in anilistSeriesView

		series.synchronizedAt = new Date();

		await this.seriesRepository.persist(series);

		return series;
	}

	protected shouldSynchronize(seriesEntity: SeriesEntity): boolean
	{
		// never synced, so it should sync now
		if(!seriesEntity?.synchronizedAt) {
			return true;
		}

		// Compare now with the synchronizedAt datetime,
		// it does not need to be re-fetched if it is less then 1 day old

		const now = DateTime.now();
		const synchronizedAt = DateTime.fromJSDate(seriesEntity.synchronizedAt);
		const oneDay = Duration.fromDurationLike({ day: 1, });

		// console.log(`Should synchronize ${seriesEntity.anilistId}? ${synchronizedAt < now.minus(oneDay) ? 'true' : 'false'}`);

		return synchronizedAt < now.minus(oneDay);
	}
}
