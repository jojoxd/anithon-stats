import {defineConfig} from "@mikro-orm/core";
import { $log } from "@tsed/common";
import * as entities from "../../domain/entity";
import {rootDir} from "../index";
//import {isProduction} from '../env';

export default defineConfig({
	contextName: "default",

	entities: Object.values(entities),

	type: 'mariadb',
	clientUrl: process.env.DATABASE_DSN,

//	debug: !isProduction,
//	verbose: !isProduction,
	logger: (msg) => $log.info(msg),

	migrations: {
		pathTs: `${rootDir}/migrations`,
	},
});
