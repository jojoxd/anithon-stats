import {SqliteDataSource} from "../../../datasources/sqlite.data-source";
import {registerProvider} from "@tsed/di";
import {SessionEntity} from "../../entity/session/session.entity";

const SessionRepositoryImpl = SqliteDataSource.getRepository(SessionEntity).extend({

});

export const SessionRepository = Symbol.for("SessionRepositoryImpl");
export type SessionRepository = typeof SessionRepositoryImpl;

registerProvider<SessionRepository>({
	provide: SessionRepository,
	useValue: SessionRepositoryImpl,
});
