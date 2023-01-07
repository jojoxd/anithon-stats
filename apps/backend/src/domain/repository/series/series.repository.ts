import {SqliteDataSource} from "../../../datasources/sqlite.data-source";
import {registerProvider} from "@tsed/di";
import {SeriesEntity} from "../../entity/series/series.entity";

const SeriesRepositoryImpl = SqliteDataSource.getRepository(SeriesEntity).extend({

});

export const SeriesRepository = Symbol.for("SeriesRepositoryImpl");
export type SeriesRepository = typeof SeriesRepositoryImpl;

registerProvider<SeriesRepository>({
	provide: SeriesRepository,
	useValue: SeriesRepositoryImpl,
});
