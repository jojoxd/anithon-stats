import {AbstractSqlConnection, Knex} from "@mikro-orm/knex";
import {registerProvider} from "@tsed/di";
import {Orm} from "@tsed/mikro-orm";
import {MikroORM} from "@mikro-orm/core";

registerProvider({
	provide: Knex,

	deps: [
		Orm,
	],

	useFactory(orm: MikroORM) {
		const sqlConnection = orm.em.getDriver().getConnection() as AbstractSqlConnection;

		return sqlConnection.getKnex();
	},
});
