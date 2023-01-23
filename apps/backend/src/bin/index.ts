#!/usr/bin/env node
import {CliCore} from "@tsed/cli-core";
import {config} from "../config";
import {HelloCommand} from "./HelloCommand";
import {SyncDatabaseCommand} from "./sync-database.command";

CliCore.bootstrap({
  ...config,
  commands: [
    HelloCommand,

	SyncDatabaseCommand,
  ]
}).catch(console.error);