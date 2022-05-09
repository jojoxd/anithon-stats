# tsed-entity-mapper

Map entities in your Controller functions!


```ts
import {PathParamEntity} from ".";
import {Controller} from "@tsed/common";
import {Inject} from "@tsed/di";

@Controller("/:myParam")
export class MyController
{
    @Inject()
    protected readonly myService!: MyService;

    @Get("/do/something")
    async doSomething(@PathParamEntity("myParam") myEntity: MyEntity): Promise<any>
    {
        return this.myService.doIt(myEntity);
    }
}
```



## EntityMapper

You need to define Entity Mappers per Entity you want to Map.

```ts
import {EntityMapperMethods} from ".";
import {Inject} from "@tsed/di";

@EntityMapper(MyEntity)
export class MyEntityMapper implements EntityMapperMethods
{
    @Inject()
    protected readonly myRepository!: MyRepository;

    map(value: unknown, context: EntityMapperMapContext): Promise<MyEntity | undefined>
    {
        return this.myRepository.findOne({
            where: {
                id: value as number
            }
        }) ?? undefined;
    }
}
```