import {EntityMapper, EntityMapperMapContext, EntityMapperMethods} from "@jojoxd/tsed-entity-mapper";
import {UserList} from "../../entity/UserList";
import {AnilistUserManager} from "../AnilistUserManager";
import {Inject} from "@tsed/di";
import {BadRequest, InternalServerError, NotFound} from "@tsed/exceptions";
import {useDecorators} from "@tsed/core";
import {Returns} from "@tsed/schema";

@EntityMapper(UserList)
export class UserListMapper implements EntityMapperMethods<UserList>
{
    @Inject()
    protected anilistUserManager!: AnilistUserManager;

    async map(value: unknown, ctx: EntityMapperMapContext<UserList>): Promise<UserList | undefined>
    {
		if(!value)
			throw new BadRequest("Something went wrong fetching User (No List ID)");

        const user = await this.anilistUserManager.findUserByListUuid(value as string);

        if(!user)
        	throw new NotFound("User not found");

        const list = user?.lists?.find((list) => list.id === value) ?? undefined;

        if(!list)
        	throw new NotFound("List not found");

        return list;
    }
}

export function UserListMapperDecorator()
{
	return useDecorators(
		Returns(400, BadRequest)
			.Description("Something went wrong fetching User (No List ID)"),

		Returns(404, NotFound)
			.Description("User not found"),

		Returns(404, NotFound)
			.Description("List not found"),
	);
}
