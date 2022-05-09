import {AnilistUser} from "../../entity/AnilistUser";
import {AnilistUserManager} from "../AnilistUserManager";
import {EntityMapper, EntityMapperMapContext, EntityMapperMethods} from "@jojoxd/tsed-entity-mapper";
import {Inject} from "@tsed/di";
import { $log } from "@tsed/common";

@EntityMapper(AnilistUser)
export class AnilistUserMapper implements EntityMapperMethods<AnilistUser>
{
    @Inject()
    protected anilistUserManager!: AnilistUserManager;

    async map(value: string, context: EntityMapperMapContext<any>): Promise<AnilistUser | undefined>
    {
        $log.info(`UserMapper: getUserByAnilistId(${value})`);

        // { options: { type: "userName" } }
        let user = null;

        if(!value)
            return undefined;

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

        $log.info(`UserMapper: ${value} => ${user?.userName}`);

        return user ?? undefined;
    }
}
