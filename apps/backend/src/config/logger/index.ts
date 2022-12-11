import {PlatformLoggerSettings, $log} from "@tsed/common";
import {isProduction} from "../env";

if (isProduction) {
  $log.appenders.set("stdout", {
    type: "stdout",
    levels: ["info", "debug"],
    layout: {
      type: "json"
    }
  });

  $log.appenders.set("stderr", {
    levels: ["trace", "fatal", "error", "warn"],
    type: "stderr",
    layout: {
      type: "json"
    }
  });
}

$log.level = isProduction ? 'info' : 'debug';
$log.info('%s Mode', isProduction ? 'Production' : 'Development');

export const loggerConfig: Partial<PlatformLoggerSettings> = {
  disableRoutesSummary: isProduction,
};
