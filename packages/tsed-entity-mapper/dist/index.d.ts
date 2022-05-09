import { Type } from '@tsed/core';
import { ProviderOpts, InjectorService } from '@tsed/di';
import { PlatformContext } from '@tsed/common';
import { PipeMethods, JsonParameterStore } from '@tsed/schema';

interface EntityParamOptions {
    options: {
        [k: string]: unknown;
    };
}

interface EntityMapperMapContext<T> {
    ctx: PlatformContext;
    options: EntityParamOptions["options"];
}

interface EntityMapperMethods<T> {
    map(value: unknown, ctx: EntityMapperMapContext<T>): Promise<T | undefined>;
}

declare const ENTITY_MAPPER_TYPE = "tsed-entity-mapper:entity-mapper";
declare const ENTITY_MAPPER_REFLECT_DATA_KEY: string;
declare type EnsureEntityMapper<X> = <T extends new (...args: {}[]) => EntityMapperMethods<X>>(target: T) => void;
declare function EntityMapper<T>(entity: Type<T>, options?: Partial<Exclude<ProviderOpts<any>, "type">>): EnsureEntityMapper<T>;

/**
 * Convert a Body Parameter to an Entity
 */
declare function BodyParamEntity<T>(expression: string, options?: EntityParamOptions): ParameterDecorator;

declare function PathParamEntity<T>(expression: string, options?: EntityParamOptions): ParameterDecorator;

declare function QueryParamEntity<T>(expression: string, options: EntityParamOptions): ParameterDecorator;

interface ReflectMetadata {
    targetType: Type<any>;
}

declare class EntityMapperPipe<T> implements PipeMethods {
    protected injector: InjectorService;
    protected $ctx: PlatformContext;
    get entityMappers(): Array<EntityMapperMethods<any>>;
    transform(value: unknown, metadata: JsonParameterStore): Promise<any>;
}

export { BodyParamEntity, ENTITY_MAPPER_REFLECT_DATA_KEY, ENTITY_MAPPER_TYPE, EntityMapper, EntityMapperMapContext, EntityMapperMethods, EntityMapperPipe, EntityParamOptions, PathParamEntity, QueryParamEntity, ReflectMetadata };
