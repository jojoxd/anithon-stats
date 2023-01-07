import {SqliteDataSource} from "../../../datasources/sqlite.data-source";
import {registerProvider} from "@tsed/di";
import {UserEntity} from "../../entity/user/user.entity";

const UserRepositoryImpl = SqliteDataSource.getRepository(UserEntity).extend({

});

export const UserRepository = Symbol.for("UserRepositoryImpl");
export type UserRepository = typeof UserRepositoryImpl;

registerProvider<UserRepository>({
	provide: UserRepository,
	useValue: UserRepositoryImpl,
});
