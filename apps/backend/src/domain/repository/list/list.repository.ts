import {SqliteDataSource} from "../../../datasources/sqlite.data-source";
import {ListEntity} from "../../entity/list/list.entity";
import {registerProvider} from "@tsed/di";

const ListRepositoryImpl = SqliteDataSource.getRepository(ListEntity).extend({

});

export const ListRepository = Symbol.for("ListRepositoryImpl");
export type ListRepository = typeof ListRepositoryImpl;

registerProvider<ListRepository>({
	provide: ListRepository,
	useValue: ListRepositoryImpl,
});
