import {EntityRepository as EntityRepositoryBase} from "@mikro-orm/core";

export abstract class EntityRepository<T extends object> extends EntityRepositoryBase<T>
{
}
