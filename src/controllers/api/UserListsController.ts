import {Controller, Get} from "@tsed/common";
import {Inject} from "@tsed/di";
import {AnilistUserManager} from "../../services/AnilistUserManager";
import {IAnilistUserMetadata, IListData} from "@anistats/shared";
import {AnilistService, MediaType} from "@anime-rss-filter/anilist";
import {CustomAuth} from "../../guards/AuthMiddleware";
import {USERLIST_REPOSITORY} from "../../entity/repository/UserListRepository";
import {PathParamEntity} from "@jojoxd/tsed-entity-mapper";
import {UserList} from "../../entity/UserList";
import {UserController} from "./UserController";

@Controller('/list/:listId')
export class UserListsController
{
    @Inject()
    protected anilistUserManager!: AnilistUserManager;

    @Inject()
    protected anilistService!: AnilistService;

    @Inject(USERLIST_REPOSITORY)
    protected userListRepository!: USERLIST_REPOSITORY;

    @Inject()
    protected userController!: UserController;

    @Get("/user")
    async getUserByList(
        @PathParamEntity("listId") list: UserList
    ): Promise<IAnilistUserMetadata | null>
    {
    	// @TODO: Is this function still needed?
        // return await this.anilistUserManager.toIAnilistUserMetadata(list.user) ?? null;
		return null;
    }
}
