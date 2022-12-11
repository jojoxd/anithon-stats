import {Session} from "../Session";
import {registerProvider} from "@tsed/di";
import {SqliteDataSource} from "../../datasources/SqliteDataSource";

export const SessionRepository = SqliteDataSource.getRepository(Session);

export const SESSION_REPOSITORY = Symbol.for("SessionRepository");
export type SESSION_REPOSITORY = typeof SessionRepository;

registerProvider<SESSION_REPOSITORY>({
    provide: SESSION_REPOSITORY,
    useValue: SessionRepository,
});
