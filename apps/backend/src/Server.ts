import "@jojoxd/tsed-entity-mapper";
import {Configuration, Inject} from "@tsed/di";
import {BeforeRoutesInit, PlatformApplication} from "@tsed/common";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import cors from "cors";
import "@jojoxd/tsed-auth-expression";
import "@tsed/ajv";
import { config } from "./config";
import "@tsed/platform-express";
import "@tsed/platform-cache";
import "@tsed/mikro-orm";

import * as apiControllers from "./application/controller/api";

import "./domain/repository";
import "./domain/service";
import "./application/service";

import "./application/exception-filter/unauthorized.exception-filter";
import "./application/exception-filter/platform.exception-filter";

import "@tsed/swagger";
import {isProduction} from "./config/env";
import {defineRedocSettings} from "@jojoxd/tsed-util/redoc";

// @TODO: Indexed imports
import "@tsed/passport";
import "./application/strategy/anilist-v2.strategy";
import "./application/protocol/anilist-v2.protocol";
import "./application/protocol/jwt.protocol";

import "@jojoxd/tsed-util/scheduler";
import "./application/scheduler";

@Configuration({
    ...config,
    acceptMimes: ["application/json"],
    httpPort: process.env.PORT || 8083,
    httpsPort: false, // CHANGE

    mount: {
        "/api": [
			...Object.values(apiControllers),
        ],
    },

	swagger: isProduction ? undefined : [
		defineRedocSettings({
			path: '/api/docs',
			specVersion: "3.0.1",
		}),
	],

	cache: {
		ttl: 300,
		store: "memory",
	},
})
export class Server implements BeforeRoutesInit
{
    @Inject()
    app!: PlatformApplication;

    @Configuration()
    settings!: Configuration;

    $beforeRoutesInit(): void
    {
        this.app
            .use(cors())
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }));
    }
}
