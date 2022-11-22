import {AnilistUser} from "../../entity/AnilistUser";
import {AnilistUserManager} from "../AnilistUserManager";
import {EntityMapper, EntityMapperMapContext, EntityMapperMethods} from "@jojoxd/tsed-entity-mapper";
import {Inject} from "@tsed/di";
import {$log} from "@tsed/common";
import {isUserIdentifier, isUserIdentifierOfType, UserIdentifier, UserIdentifierType} from "@anistats/shared";

@EntityMapper(AnilistUser)
export class AnilistUserMapper implements EntityMapperMethods<AnilistUser>
{
    @Inject()
    protected anilistUserManager!: AnilistUserManager;

    async map(value: string | UserIdentifier, context: EntityMapperMapContext<any>): Promise<AnilistUser | undefined>
    {
        let user = null;

        if(!value)
            return undefined;

        // @TODO: Deprecate using value as a string
        if(isUserIdentifier(value)) {
            if (isUserIdentifierOfType(value, UserIdentifierType.Uuid)) {
                user = await this.anilistUserManager.getUserByUuid(value.uuid, true);
            } else if(isUserIdentifierOfType(value, UserIdentifierType.UserName)) {
                user = await this.anilistUserManager.getUserByName(value.userName, true);
            } else if(isUserIdentifierOfType(value, UserIdentifierType.AnilistUserId)) {
                user = await this.anilistUserManager.getUserByAnilistId(value.anilistUserId, true);
            } else if(isUserIdentifierOfType(value, UserIdentifierType.ListUuid)) {
            	user = await this.anilistUserManager.getUserByListUuid(value.listUuid);
			}

            return user ?? undefined;
        }

        switch(context.options.type) {
            case "userName":
                user = await this.anilistUserManager.getUserByName(value);
                break;

            case "uuid":
                user = await this.anilistUserManager.getUserByUuid(value);
                break;

            case "anilistUserId":
            default:
                user = await this.anilistUserManager.getUserByAnilistId(Number(value));
                break;
        }

        return user ?? undefined;
    }
}
