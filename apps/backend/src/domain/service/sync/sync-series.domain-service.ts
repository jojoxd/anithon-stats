import {Inject, Service} from "@tsed/di";
import { $log } from "@tsed/common";
import {SeriesRepository} from "../../repository/series/series.repository";
import {AnilistSeriesDomainService} from "../anilist/series/anilist-series.domain-service";
import {SeriesEntityFactory} from "../../factory/series/series-entity.factory";
import {SeriesEntity} from "../../entity/series/series.entity";
import {DateTime} from "luxon";
import {AnilistSeriesView} from "../../view/anilist/series/anilist-series.view";
import {AnilistSeriesId} from "@anistats/shared";
import {InternalServerError} from "@tsed/exceptions";
import {TimeUtil} from "../../util/time.util";
import {AnilistListView} from "../../view/anilist/list/anilist-list.view";
import {InjectRepository} from "@jojoxd/tsed-util/mikro-orm";

@Service()
export class SyncSeriesDomainService
{
	@InjectRepository(SeriesEntity)
	protected seriesRepository!: SeriesRepository;

	@Inject()
	protected anilistSeriesService!: AnilistSeriesDomainService;

	protected static readonly MAX_RELATION_DEPTH = 1;

	public async syncSeries(anilistIds: Array<AnilistSeriesId>): Promise<void>
	{
		const seriesViews = await this.anilistSeriesService.batchGetSeries(anilistIds, true);

		for(const [anilistSeriesId, anilistSeriesView] of seriesViews.entries()) {
			if (anilistSeriesView === null) {
				throw new InternalServerError(`Tried to sync non-existant series ${anilistSeriesId}`);
			}

			// We already use withRelated, depth can be set to 1
			await this.findOrCreateSeriesEntity(anilistSeriesId, 1, undefined, anilistSeriesView);
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

		const getDependantSeries = this.anilistSeriesService.batchGetSeries([
			...anilistSeriesView.prequelIds,
			...anilistSeriesView.sequelIds,
		], depth < SyncSeriesDomainService.MAX_RELATION_DEPTH);

		const [dependantSeries,,] = await Promise.all([
			getDependantSeries,
			series.prequels.init({ populate: true, }),
			series.sequels.init({ populate: true, }),
		]);

		for (const [dependantSeriesId, dependantSeriesView] of dependantSeries.entries()) {
			if (excludeIdsInner.includes(dependantSeriesId)) {
				continue;
			}

			const dependantSeriesEntity = await this.findOrCreateSeriesEntity(
				dependantSeriesId,
				depth,
				excludeIdsInner,
				dependantSeriesView
			);

			if (anilistSeriesView.prequelIds.includes(dependantSeriesId)) {
				series.prequels.add(dependantSeriesEntity);
			} else if(anilistSeriesView.sequelIds.includes(dependantSeriesId)) {
				series.sequels.add(dependantSeriesEntity);
			}

			await this.seriesRepository.persist(series);
		}

		// @TODO: Remove id's not included in anilistSeriesView.prequels/.sequels

		series.synchronizedAt = new Date();

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
			{ day: 1 },
			DateTime.now()
		);
	}
}
