import {join} from "path";
import moment from "moment";

const {version} = require("../../package.json");
export const rootDir = join(__dirname, "..");

import {loggerConfig} from "./logger";
import mikroOrmConfig from './mikro-orm';

export const config: Partial<TsED.Configuration> = {
  version,
  rootDir,
  logger: loggerConfig,
  // additional shared configuration

  mikroOrm: [
  	mikroOrmConfig,
  ],

  views: {
    root: `${rootDir}/views`,
    viewEngine: 'pug',

    extensions: {
      "pug": "pug"
    },

    options: {
      global: {
        moment
      }
    }
  },

  cache: {
    ttl: 100
  }
};
