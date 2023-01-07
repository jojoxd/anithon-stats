import "@jojoxd/tsed-entity-mapper";
import {Configuration, Constant, Inject, InjectorService} from "@tsed/di";
import {$log, PlatformApplication} from "@tsed/common";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import cors from "cors";
import session from "express-session";
import "@jojoxd/tsed-auth-expression";
import "@tsed/ajv";
import {config, rootDir} from "./config";
import {TypeormStore} from "connect-typeorm";
import "@tsed/platform-express";
import "@tsed/platform-cache";

import * as apiControllers from "./controllers/api";

import "./domain/service";
import "./application/service";

import "@tsed/swagger";
import {isProduction} from "./config/env";
import {SessionRepository} from "./domain/repository/session/session.repository";

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

    protected sessionStore: TypeormStore = new TypeormStore({
        cleanupLimit: 2,
        ttl: 86400
    });

    $beforeRoutesInit(): void
    {
        const sessionRepository = this.injector.get<SessionRepository>(SessionRepository);
        $log.info("Session Repo (BRI) =", sessionRepository);

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
                store: this.sessionStore,

                resave: true,
                saveUninitialized: true,
                cookie: { secure: false, httpOnly: true },
            }));
    }

    $onReady(): void
    {
        const sessionRepository = this.injector.get<SessionRepository>(SessionRepository);

        if(!sessionRepository)
            throw new Error("Failed to load Session Store");

        this.sessionStore.connect(sessionRepository);
    }
}
