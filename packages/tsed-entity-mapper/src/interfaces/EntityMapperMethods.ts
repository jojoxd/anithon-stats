import {EntityMapperMapContext} from "../domain/EntityMapperMapContext";

export interface EntityMapperMethods<T>
{
    map(value: unknown, ctx: EntityMapperMapContext<T>): Promise<T | undefined>;
}
