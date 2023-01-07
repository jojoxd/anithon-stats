import {SqliteDataSource} from "../../../datasources/sqlite.data-source";
import {registerProvider} from "@tsed/di";
import { EntryEntity } from "../../entity/entry/entry.entity";

const EntryRepositoryImpl = SqliteDataSource.getRepository(EntryEntity).extend({

});

export const EntryRepository = Symbol.for("EntryRepositoryImpl");
export type EntryRepository = typeof EntryRepositoryImpl;

registerProvider<EntryRepository>({
	provide: EntryRepository,
	useValue: EntryRepositoryImpl,
});
