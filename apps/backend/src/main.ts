import {$log} from "@tsed/common";
import {PlatformExpress} from "@tsed/platform-express";
import {Server} from "./Server";
import {config as dotenv} from "dotenv";

const config = dotenv();

async function bootstrap() {
  $log.level = "debug";

  try {
    $log.debug("Start server...");
    const platform = await PlatformExpress.bootstrap(Server, config.parsed ?? process.env);

    await platform.listen();
    $log.debug("Server initialized");
  } catch (er) {
    $log.error(er);
  }
}

bootstrap();
