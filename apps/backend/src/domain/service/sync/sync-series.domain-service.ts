import {Constant, Inject, Service} from "@tsed/di";
import {SeriesRepository} from "../../repository/series/series.repository";
import {AnilistSeriesDomainService} from "../anilist/series/anilist-series.domain-service";
import {SeriesEntityFactory} from "../../factory/series/series-entity.factory";
import {SeriesEntity} from "../../entity/series/series.entity";
import {DateTime, DurationLike} from "luxon";
import {AnilistSeriesView} from "../../view/anilist/series/anilist-series.view";
import {AnilistSeriesId} from "@anistats/shared";
import {InternalServerError} from "@tsed/exceptions";
import {TimeUtil} from "../../util/time.util";
import {AnilistListView} from "../../view/anilist/list/anilist-list.view";
import {InjectRepository} from "@jojoxd/tsed-util/mikro-orm";
import { $log } from "@tsed/common";

@Service()
export class SyncSeriesDomainService
{
	@InjectRepository(SeriesEntity)
	protected seriesRepository!: SeriesRepository;

	@Inject()
	protected anilistSeriesService!: AnilistSeriesDomainService;

	@Constant('app.series.syncTimeout')
	protected readonly seriesSyncTimeout!: DurationLike;

	protected static readonly MAX_RELATION_DEPTH = 1;

	public async syncSeries(anilistIds: Array<AnilistSeriesId>): Promise<void>
	{
		$log.info('count ids', anilistIds.length);
		const seriesViews = await this.anilistSeriesService.batchGetSeries(anilistIds, true);
		$log.info('Count Series', seriesViews.size);

		for(const [anilistSeriesId, anilistSeriesView] of seriesViews.entries()) {
			if (anilistSeriesView === null) {
				throw new InternalServerError(`Tried to sync non-existant series ${anilistSeriesId}`);
			}

			// We already use withRelated, depth can be set to 1
			await this.findOrCreateSeriesEntity(anilistSeriesId, 0, undefined, anilistSeriesView);
		}
	}

	public async syncList(anilistListView: AnilistListView): Promise<void>
	{
		for(const anilistSeriesView of anilistListView.entries) {
			await this.findOrCreateSeriesEntity(anilistSeriesView.id, 0, undefined, anilistSeriesView);
		}
	}

	public async findOrCreateSeriesEntity(anilistId: AnilistSeriesId, depth = 0, excludeIds?: Array<any>, anilistSeriesView?: AnilistSeriesView): Promise<SeriesEntity>
	{
		let series = await this.seriesRepository.findOne({ anilistId });

		if (series && !this.shouldSynchronize(series)) {
			console.log(`no-sync(${series.anilistId})`);
			return series;
		}

		const seriesViewProvided = typeof anilistSeriesView !== "undefined";
		anilistSeriesView ??= await this.anilistSeriesService.getSeries(anilistId);
		const excludeIdsInner = excludeIds ?? [];

		if (!series) {
			console.log(`create(${anilistId})`);

			series = SeriesEntityFactory.create(anilistSeriesView);
			await this.seriesRepository.persistAndFlush(series);
		}

		console.log(`sync(${series.anilistId})`);

		if(depth >= SyncSeriesDomainService.MAX_RELATION_DEPTH || !seriesViewProvided) {
			return series;
		}
		depth += 1;

		excludeIdsInner.push(series.anilistId);

		await Promise.all([
			series.prequels.init({ populate: true, }),
			series.sequels.init({ populate: true, }),
		]);

		// @TODO: Maybe use prequelIds/sequelIds when we have no relations?
		if (anilistSeriesView.relations !== null) {
			for (const relation of anilistSeriesView.relations) {
				if (excludeIdsInner.includes(relation.id)) {
					continue;
				}

				// If not prequel or sequel, continue
				if (![...anilistSeriesView.prequelIds, ...anilistSeriesView.sequelIds].includes(relation.id)) {
					continue;
				}

				const relationSeriesEntity = await this.findOrCreateSeriesEntity(
						relation.id,
						depth,
						excludeIdsInner,
						relation
						);

				if (anilistSeriesView.prequelIds.includes(relation.id)) {
					series.prequels.add(relationSeriesEntity);
				} else if(anilistSeriesView.sequelIds.includes(relation.id)) {
					series.sequels.add(relationSeriesEntity);
				}

				await this.seriesRepository.persist(series);
			}

			series.synchronizedAt = new Date();
		}

		// @TODO: Remove id's not included in anilistSeriesView.prequels/.sequels

		await this.seriesRepository.persistAndFlush(series);

		return series;
	}

	protected shouldSynchronize(seriesEntity: SeriesEntity): boolean
	{
		// never synced, so it should sync now
		if(!seriesEntity?.synchronizedAt) {
			return true;
		}

		return TimeUtil.hasTimedOut(
			seriesEntity.synchronizedAt,
			this.seriesSyncTimeout,
			DateTime.now()
		);
	}
}
