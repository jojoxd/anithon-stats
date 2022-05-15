import { Type } from '@tsed/core';
import { ProviderOpts, InjectorService } from '@tsed/di';
import { PlatformContext } from '@tsed/common';
import { PipeMethods, JsonParameterStore } from '@tsed/schema';
import { ValidationPipe as ValidationPipe$1, PipeMethods as PipeMethods$1, DeserializerPipe as DeserializerPipe$1 } from '@tsed/platform-params';

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
declare function BodyParamEntity<T>(expression?: string, options?: EntityParamOptions): ParameterDecorator;

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

declare class ValidationPipe extends ValidationPipe$1 implements PipeMethods$1 {
    transform(value: any, metadata: JsonParameterStore): Promise<any>;
}

declare class DeserializerPipe extends DeserializerPipe$1 implements PipeMethods$1 {
    transform(value: any, metadata: JsonParameterStore): Promise<any>;
}

export { BodyParamEntity, DeserializerPipe, ENTITY_MAPPER_REFLECT_DATA_KEY, ENTITY_MAPPER_TYPE, EntityMapper, EntityMapperMapContext, EntityMapperMethods, EntityMapperPipe, EntityParamOptions, PathParamEntity, QueryParamEntity, ReflectMetadata, ValidationPipe };
