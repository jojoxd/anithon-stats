import {join} from "path";
import {loggerConfig} from "./logger";
import typeormConfig from "./typeorm";
import moment from "moment";

const {version} = require("../../package.json");
export const rootDir = join(__dirname, "..");

export const config: Partial<TsED.Configuration> = {
  version,
  rootDir,
  logger: loggerConfig,
  typeorm: typeormConfig,
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
  }
};
