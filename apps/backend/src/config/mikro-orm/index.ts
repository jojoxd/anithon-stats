import {defineConfig} from "@mikro-orm/core";
import { $log } from "@tsed/common";
import * as entities from "../../domain/entity";
import {rootDir} from "../index";

$log.info(`Using ${process.env.DATABASE_DSN} as database for MikroORM connection 'default'`);

export default defineConfig({
	contextName: "default",

	entities: Object.values(entities),

	type: 'mariadb',
	clientUrl: process.env.DATABASE_DSN,

	migrations: {
		pathTs: `${rootDir}/migrations`,
	},
});
