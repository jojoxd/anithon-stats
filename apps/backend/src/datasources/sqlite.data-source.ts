import {DataSource} from "typeorm";
import {Configuration, registerProvider} from "@tsed/di";
import { Logger, $log } from "@tsed/common";
import {Env} from "@tsed/core";
import {EntryEntity} from "../domain/entity/entry/entry.entity";
import {EntryDataEntity} from "../domain/entity/entry/entry-data.entity";
import {ListEntity} from "../domain/entity/list/list.entity";
import {ListSettingsEntity} from "../domain/entity/list/list-settings.entity";
import {SeriesEntity} from "../domain/entity/series/series.entity";
import {UserEntity} from "../domain/entity/user/user.entity";
import {SessionEntity} from "../domain/entity/session/session.entity";

export const SQLITE_DATASOURCE = Symbol.for("SqliteDataSource");

export const SqliteDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",

    synchronize: true,

	cache: false,

    entities: [
    	SessionEntity,

        EntryEntity,
		EntryDataEntity,

		ListEntity,
		ListSettingsEntity,

		SeriesEntity,

		UserEntity,
    ],
});

registerProvider<DataSource>({
    provide: SQLITE_DATASOURCE,
    type: "typeorm:datasource",
    deps: [Logger, Configuration],

    async useAsyncFactory(logger: Logger, conf: Configuration)
    {
        // SqliteDataSource.setOptions({
        //     logging: conf.env === Env.DEV,
        // });

        await SqliteDataSource.initialize();

        $log.info("Connected with typeorm to database: Sqlite");

        return SqliteDataSource;
    },

    hooks: {
        $onDestroy(dataSource: DataSource)
        {
            return dataSource.isInitialized && dataSource.destroy();
        }
    }
});
