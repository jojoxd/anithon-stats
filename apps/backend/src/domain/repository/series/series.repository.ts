import { Constant } from "@tsed/di";
import { DateTime, DurationLike } from "luxon";
import {SeriesEntity} from "../../entity/series/series.entity";
import {BaseEntityRepository} from "../base-entity.repository";

export class SeriesRepository extends BaseEntityRepository<SeriesEntity>
{
	@Constant('app.series.syncTimeout')
	protected readonly seriesSyncTimeout!: DurationLike;

	public async findSyncableSeries(limit = 50): Promise<SeriesEntity[]>
	{
		return await this.findAll({
			having: {
				$or: [
					{
						synchronizedAt: null,
					}, {
						synchronizedAt: {
							$lt: DateTime.now().minus(this.seriesSyncTimeout).toJSDate(),
						},
					},
				],
			},

			limit,

			orderBy: {
				synchronizedAt: 'ASC'
			},
		});
	}
}
