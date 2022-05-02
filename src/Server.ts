import {Configuration, Constant, Inject, InjectorService} from "@tsed/di";
import {$log, PlatformApplication} from "@tsed/common";
import "@tsed/platform-express";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import cors from "cors";
import session from "express-session";
import "@tsed/ajv";
import "@tsed/typeorm";
import {config, rootDir} from "./config";
import {TypeormStore} from "@jojoxd/connect-typeorm";
import {SESSION_REPOSITORY} from "./entity/repository/SessionRepository";
import {SQLITE_DATASOURCE} from "./datasources/SqliteDataSource";
import {DataSource} from "typeorm";

@Configuration({
    ...config,
    acceptMimes: ["application/json"],
    httpPort: process.env.PORT || 8083,
    httpsPort: false, // CHANGE

    mount: {
        "/api": [
            `${rootDir}/controllers/api/**/*.ts`
        ],
    },

    exclude: [
        "**/*.spec.ts"
    ]
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
        const sessionRepository = this.injector.get<SESSION_REPOSITORY>(SESSION_REPOSITORY);
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
        const ds = this.injector.get<DataSource>(SQLITE_DATASOURCE);
        $log.info("DataSource (Server)", ds);

        $log.info("SessRepo Exists? ", this.injector.has(SESSION_REPOSITORY));

        const sessionRepository = this.injector.get<SESSION_REPOSITORY>(SESSION_REPOSITORY);

        $log.info(this.injector.get<SESSION_REPOSITORY>(SESSION_REPOSITORY));

        $log.info("Session Repo =", sessionRepository);

        this.sessionStore.connect(sessionRepository);
    }
}
