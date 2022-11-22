import {Inject, Injectable, InjectContext, InjectorService, ProviderScope} from "@tsed/di";
import {JsonParameterStore, PipeMethods} from "@tsed/schema";
import {Store} from "@tsed/core";
import {PlatformContext} from "@tsed/common";

import {EntityParamOptions} from "../domain/EntityParamOptions";
import {EntityMapperMethods} from "../interfaces/EntityMapperMethods";
import {ENTITY_MAPPER_REFLECT_DATA_KEY, ENTITY_MAPPER_TYPE} from "../decorators/mapper/EntityMapper";
import {ReflectMetadata} from "../domain/ReflectMetadata";
import {EntityMapperMapContext} from "../domain/EntityMapperMapContext";


@Injectable({ scope: ProviderScope.REQUEST })
export class EntityMapperPipe<T> implements PipeMethods
{
    @Inject()
    protected injector!: InjectorService;

    @InjectContext()
    protected $ctx!: PlatformContext;

    get entityMappers(): Array<EntityMapperMethods<any>>
    {
        return this.injector.getMany(ENTITY_MAPPER_TYPE);
    }

    async transform(value: unknown, metadata: JsonParameterStore): Promise<any>
    {
        const paramOptions = metadata.store.get<EntityParamOptions>(EntityMapperPipe) as EntityParamOptions;

        const entityMapper = this.entityMappers.find(entityMapper => {
            const entityMapperMetadata = Store.from(entityMapper).get<ReflectMetadata | undefined>(ENTITY_MAPPER_REFLECT_DATA_KEY);

            return entityMapperMetadata?.targetType === metadata.type;
        });

        const context: EntityMapperMapContext<T> = {
            options: paramOptions.options,
            ctx: this.$ctx,
        };

        return entityMapper?.map(value, context);
    }
}
