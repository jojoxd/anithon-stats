import {DataSource} from "typeorm";
import {Configuration, registerProvider} from "@tsed/di";
import { Logger, $log } from "@tsed/common";
import {Env} from "@tsed/core";
import {Session} from "../entity/Session";
import {AnilistUser} from "../entity/AnilistUser";
import {UserList} from "../entity/UserList";
import {SavedData} from "../entity/SavedData";

export const SQLITE_DATASOURCE = Symbol.for("SqliteDataSource");

export const SqliteDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",

    synchronize: true,
    logging: true, // @TODO: Load env

    entities: [
        AnilistUser,
        SavedData,
        Session,
        UserList,
    ],
});

registerProvider<DataSource>({
    provide: SQLITE_DATASOURCE,
    type: "typeorm:datasource",
    deps: [Logger, Configuration],

    async useAsyncFactory(logger: Logger, conf: Configuration)
    {
        SqliteDataSource.setOptions({
            logging: conf.env === Env.DEV,
        });

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
