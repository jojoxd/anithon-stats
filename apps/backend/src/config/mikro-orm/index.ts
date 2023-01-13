import {defineConfig} from "@mikro-orm/core";
import * as entities from "../../domain/entity";
import {rootDir} from "../index";

export default defineConfig({
	contextName: "default",

	entities: Object.values(entities),

	type: 'mariadb',
	clientUrl: process.env.DATABASE_DSN,

	migrations: {
		pathTs: `${rootDir}/migrations`,
	},
});
