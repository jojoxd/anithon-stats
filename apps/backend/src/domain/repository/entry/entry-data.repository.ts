import {SqliteDataSource} from "../../../datasources/sqlite.data-source";
import {registerProvider} from "@tsed/di";
import {EntryDataEntity} from "../../entity/entry/entry-data.entity";

const EntryDataRepositoryImpl = SqliteDataSource.getRepository(EntryDataEntity).extend({

});

export const EntryDataRepository = Symbol.for("EntryDataRepositoryImpl");
export type EntryDataRepository = typeof EntryDataRepositoryImpl;

registerProvider<EntryDataRepository>({
	provide: EntryDataRepository,
	useValue: EntryDataRepositoryImpl,
});
