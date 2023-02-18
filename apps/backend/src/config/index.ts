import {join} from "path";
import moment from "moment";

const {version} = require("../../package.json");
export const rootDir = join(__dirname, "..");

import {loggerConfig} from "./logger";
import mikroOrmConfig from './mikro-orm';
import jwt from "./jwt";
import app from "./app";
import anilist from "./anilist";

export const config: Partial<TsED.Configuration> = {
	version,
	rootDir,

	app,

	logger: loggerConfig,

	mikroOrm: [
		mikroOrmConfig,
	],

	jwt,

	anilist,

	passport: {
		disableSession: true,
	},

	cache: {
		ttl: 100
	}
};
