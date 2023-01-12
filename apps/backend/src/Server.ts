import "@jojoxd/tsed-entity-mapper";
import {Configuration, Constant, Inject, InjectorService} from "@tsed/di";
import {PlatformApplication} from "@tsed/common";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import cors from "cors";
import session from "express-session";
import "@jojoxd/tsed-auth-expression";
import "@tsed/ajv";
import {config, rootDir} from "./config";
import "@tsed/platform-express";
import "@tsed/platform-cache";
import "@tsed/mikro-orm";

import * as apiControllers from "./controllers/api";

import "./domain/repository";
import "./domain/service";
import "./application/service";

import "@tsed/swagger";
import {isProduction} from "./config/env";
import { Knex } from "@mikro-orm/knex";
import createKnexStore from "connect-session-knex";

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

	swagger: isProduction ? undefined : [{
    	path: '/api/docs',
		viewPath: `redoc.ejs`,
		specVersion: "3.0.1"
	}],

	views: isProduction ? undefined : {
    	root: `${rootDir}/static/views`,
		extensions: {
    		ejs: 'ejs',
		},
	},

	cache: {
    	ttl: 300,
		store: "memory",
	},
})
export class Server
{
    @Inject()
    app!: PlatformApplication;

    @Configuration()
    settings!: Configuration;

    @Constant("SESSION_SECRET")
    protected readonly sessionSecret!: string;

    @Inject()
    protected readonly injector!: InjectorService;

    $beforeRoutesInit(): void
    {
        const knex = this.injector.get<Knex>(Knex);
        const KnexStore = createKnexStore(session);

        this.app
            .use(cors())
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }))
            .use(session({
                name: "SESSID",
                secret: this.sessionSecret,
                store: new KnexStore({ knex, createtable: true, }),

                resave: true,
                saveUninitialized: true,
                cookie: { secure: false, httpOnly: true },
            }));
    }
}
