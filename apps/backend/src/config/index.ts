import {join} from "path";
import {loggerConfig} from "./logger";
import moment from "moment";

const {version} = require("../../package.json");
export const rootDir = join(__dirname, "..");

export const config: Partial<TsED.Configuration> = {
  version,
  rootDir,
  logger: loggerConfig,
  // additional shared configuration

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
