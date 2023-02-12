import { EntityName } from "@mikro-orm/core";
import {SqlEntityRepository} from "@mikro-orm/knex";

export abstract class BaseEntityRepository<T extends object> extends SqlEntityRepository<T>
{
	public override readonly entityName!: EntityName<T>;
}
