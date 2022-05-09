import {Controller, Get, QueryParams} from "@tsed/common";
import {BadRequest} from "@tsed/exceptions";
import {Inject} from "@tsed/di";
import {Header} from "@tsed/schema";
import {AnilistUserManager} from "../../services/AnilistUserManager";
import {Deprecated} from "@tsed/core";

@Controller('/user/lists')
export class UserListsController
{
    @Inject()
    protected anilistUserManager!: AnilistUserManager;

    @Get()
    @Header({
        'Cache-Control': 'no-store',
    })
    @Deprecated("Use UserController instead (/user/lists/data?userName={userName})")
    async getIndex(@QueryParams('user') userName: string)
    {
        if(!userName)
            throw new BadRequest('User not defined');

        const user = await this.anilistUserManager.getUserByName(userName);

        if(!user)
            throw new Error("User does not exist");

        return user.lists
            ?.map(list => list.listName)
            .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    }
}
