import {AnilistUser} from "../../entity/AnilistUser";
import {AnilistUserManager} from "../AnilistUserManager";
import {EntityMapper, EntityMapperMapContext, EntityMapperMethods} from "@jojoxd/tsed-entity-mapper";
import {Inject} from "@tsed/di";
import {$log} from "@tsed/common";
import {isUserIdentifier, isUserIdentifierOfType, UserIdentifier, UserIdentifierType} from "@anistats/shared";
import {BadRequest, InternalServerError, NotFound} from "@tsed/exceptions";
import {useDecorators} from "@tsed/core";
import {Returns} from "@tsed/schema";

@EntityMapper(AnilistUser)
export class AnilistUserMapper implements EntityMapperMethods<AnilistUser>
{
    @Inject()
    protected anilistUserManager!: AnilistUserManager;

    async map(value: string | UserIdentifier, context: EntityMapperMapContext<any>): Promise<AnilistUser | undefined>
    {
        let user = null;

        if(!value || !isUserIdentifier(value))
        	throw new BadRequest("Validation Failed, not a User Identifier");

		if (isUserIdentifierOfType(value, UserIdentifierType.Uuid)) {
			user = await this.anilistUserManager.getUserByUuid(value.uuid);
		} else if(isUserIdentifierOfType(value, UserIdentifierType.UserName)) {
			user = await this.anilistUserManager.getUserByName(value.userName);
		} else if(isUserIdentifierOfType(value, UserIdentifierType.AnilistUserId)) {
			user = await this.anilistUserManager.getUserByAnilistId(value.anilistUserId);
		} else if(isUserIdentifierOfType(value, UserIdentifierType.ListUuid)) {
			user = await this.anilistUserManager.getUserByListUuid(value.listUuid);
		}

		if(!user)
			throw new NotFound("User does not exist");

		return user;
    }
}

export function AnilistUserMapperDecorator()
{
	return useDecorators(
		Returns(400, BadRequest)
			.Description("Validation Failed, not a User Identifier"),

		Returns(404, NotFound)
			.Description("User does not exist"),
	);
}
