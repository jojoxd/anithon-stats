import {SqliteDataSource} from "../../../datasources/sqlite.data-source";
import {ListSettingsEntity} from "../../entity/list/list-settings.entity";
import {registerProvider} from "@tsed/di";

const ListSettingsRepositoryImpl = SqliteDataSource.getRepository(ListSettingsEntity).extend({

});

export const ListSettingsRepository = Symbol.for("ListSettingsRepositoryImpl");
export type ListSettingsRepository = typeof ListSettingsRepositoryImpl;

registerProvider<ListSettingsRepository>({
	provide: ListSettingsRepository,
	useValue: ListSettingsRepositoryImpl,
});
