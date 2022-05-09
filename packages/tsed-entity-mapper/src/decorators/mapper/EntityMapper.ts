import {Type, useDecorators, Store} from "@tsed/core";
import {Injectable, ProviderOpts} from "@tsed/di";
import {EntityMapperMethods} from "../../interfaces/EntityMapperMethods";

export const ENTITY_MAPPER_TYPE = "tsed-entity-mapper:entity-mapper";

export const ENTITY_MAPPER_REFLECT_DATA_KEY = ENTITY_MAPPER_TYPE + ":metadata";

type EnsureEntityMapper<X> = <T extends new(...args: {}[]) => EntityMapperMethods<X>>(target: T) => void;

export function EntityMapper<T>(entity: Type<T>, options?: Partial<Exclude<ProviderOpts<any>, "type">>): EnsureEntityMapper<T>
{
    options ??= {};

    options.type = ENTITY_MAPPER_TYPE;

    return useDecorators(
        Injectable(options),
        (target: any) => {
            Store.from(target).merge(ENTITY_MAPPER_REFLECT_DATA_KEY, { targetType: entity })
        },
    );
}
