import {SqlEntityRepository} from "@mikro-orm/knex";

export abstract class BaseEntityRepository<T extends object> extends SqlEntityRepository<T>
{
}
