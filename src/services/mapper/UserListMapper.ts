import {EntityMapper, EntityMapperMapContext, EntityMapperMethods} from "@jojoxd/tsed-entity-mapper";
import {UserList} from "../../entity/UserList";
import {AnilistUserManager} from "../AnilistUserManager";
import {Inject} from "@tsed/di";

@EntityMapper(UserList)
export class UserListMapper implements EntityMapperMethods<UserList>
{
    @Inject()
    protected anilistUserManager!: AnilistUserManager;

    async map(value: unknown, ctx: EntityMapperMapContext<UserList>): Promise<UserList | undefined>
    {
        const user = await this.anilistUserManager.findUserByListUuid(value as string);

        return user?.lists?.find((list) => list.id === value) ?? undefined;
    }
}
