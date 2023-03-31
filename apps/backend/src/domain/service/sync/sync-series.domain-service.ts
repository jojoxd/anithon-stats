import {Constant, Inject, Service} from "@tsed/di";
import {SeriesRepository} from "../../repository/series/series.repository";
import {AnilistSeriesDomainService} from "../anilist/series/anilist-series.domain-service";
import {SeriesEntityFactory} from "../../factory/series/series-entity.factory";
import {SeriesEntity} from "../../entity/series/series.entity";
import {DateTime, DurationLike} from "luxon";
import {AnilistMediaId} from "@anistats/shared";
import {TimeUtil} from "../../util/time.util";
import {InjectRepository} from "@jojoxd/tsed-util/mikro-orm";
import { $log } from "@tsed/common";
import {MetricService} from "@jojoxd/tsed-util/prometheus";
import { Histogram } from "prom-client";
import {MediaListGroupView} from "../../view/anilist/list/get-user-lists/media-list-group.view";
import {MediaFragmentView} from "../../view/anilist/media/media-fragment.view";
import {MediaRelatedFragmentView} from "../../view/anilist/media/media-related-fragment.view";

@Service()
export class SyncSeriesDomainService
{
	@InjectRepository(SeriesEntity)
	protected seriesRepository!: SeriesRepository;

	@Inject()
	protected anilistSeriesService!: AnilistSeriesDomainService;

	@Constant('app.series.syncTimeout')
	protected readonly seriesSyncTimeout!: DurationLike;

	protected readonly syncHistogram: Histogram;

	constructor(@Inject() metrics: MetricService) {
		this.syncHistogram = metrics.createHistogram({
			name: "sync_series",
			help: "Synced Series",
		});
	}

	public async syncSeries(anilistIds: Array<AnilistMediaId>): Promise<void>
	{
		$log.info('count ids', anilistIds.length);
		const mediaRelatedFragmentViews = await this.anilistSeriesService.batchGetSeries(anilistIds);
		$log.info('Count Series', mediaRelatedFragmentViews.length);

		for(const mediaRelatedFragmentView of mediaRelatedFragmentViews) {
			await this.findOrCreateSeriesEntity(mediaRelatedFragmentView);
		}
	}

	public async syncList(mediaListGroupView: MediaListGroupView): Promise<void>
	{
		for(const mediaListGroupEntryView of mediaListGroupView.entries) {
			await this.findOrCreateSeriesEntity(mediaListGroupEntryView.media);
		}
	}

	public async findOrCreateSeriesEntity(mediaFragmentView: MediaFragmentView): Promise<SeriesEntity>
	{
		let series = await this.seriesRepository.findOne({ anilistId: mediaFragmentView.id, });

		if (series && !this.shouldSynchronize(series)) {
			console.log(`no-sync(${series.anilistId})`);

			return series;
		}

		this.syncHistogram.observe(1);
		const endHistogramTimer = this.syncHistogram.startTimer();

		if(!series) {
			console.log(`create(${mediaFragmentView.id})`);

			series = SeriesEntityFactory.create(mediaFragmentView);
			await this.seriesRepository.persistAndFlush(series);
		}

		await Promise.all([
			series.prequels.loadItems(),
			series.sequels.loadItems(),
		]);

		if (mediaFragmentView instanceof MediaRelatedFragmentView) {
			console.log(`sync(${series.anilistId})`);

			// @TODO: Reverse match to remove (or maybe set items to empty?)

			for(const prequelFragmentView of mediaFragmentView.prequels) {
				const prequelEntity = await this.findOrCreateSeriesEntity(prequelFragmentView);
				console.log(`link(${series.anilistId}, prequel:${prequelEntity.anilistId})`);

				series.prequels.add(prequelEntity);
			}

			for(const sequelFragmentView of mediaFragmentView.sequels) {
				const sequelEntity = await this.findOrCreateSeriesEntity(sequelFragmentView);
				console.log(`link(${series.anilistId}, sequel:${sequelEntity.anilistId})`);

				series.sequels.add(sequelEntity);
			}
		}

		series.synchronizedAt = new Date();
		await this.seriesRepository.persistAndFlush(series);

		endHistogramTimer();
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
