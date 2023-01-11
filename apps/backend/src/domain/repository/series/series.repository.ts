import {SqliteDataSource} from "../../../datasources/sqlite.data-source";
import {registerProvider} from "@tsed/di";
import {SeriesEntity} from "../../entity/series/series.entity";
import {EntityRepository} from "@mikro-orm/core";

const SeriesRepositoryImpl = SqliteDataSource.getRepository(SeriesEntity).extend({
	async getFullSeriesByAnilistId(anilistId: any): Promise<SeriesEntity | null> {
		return this.createQueryBuilder("s")
			.select("s.*")
			.where({ anilistId })
			.leftJoinAndSelect("s.prequels", "prequels")
			.leftJoinAndSelect("s.sequels", "sequels")
			.leftJoinAndSelect("s.entries", "entries")
			.getOne()
	}
});

export const SeriesRepository = Symbol.for("SeriesRepositoryImpl");
export type SeriesRepository = typeof SeriesRepositoryImpl;

registerProvider<SeriesRepository>({
	provide: SeriesRepository,
	useValue: SeriesRepositoryImpl,
});
