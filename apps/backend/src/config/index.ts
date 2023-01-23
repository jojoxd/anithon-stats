import {join} from "path";
import moment from "moment";

const {version} = require("../../package.json");
export const rootDir = join(__dirname, "..");

import {loggerConfig} from "./logger";
import mikroOrmConfig from './mikro-orm';
import jwt from "./jwt";

export const config: Partial<TsED.Configuration> = {
	version,
	rootDir,

	logger: loggerConfig,

	mikroOrm: [
		mikroOrmConfig,
	],

	jwt,

	passport: {
		disableSession: true,
	},

	// @TODO: Remove views directive, @tsed/views if installed
	views: {
		root: `${rootDir}/views`,
		viewEngine: 'pug',

		extensions: {
			"pug": "pug"
		},

		options: {
			global: {
				moment
			},
		},
	},

	cache: {
		ttl: 100
	}
};
