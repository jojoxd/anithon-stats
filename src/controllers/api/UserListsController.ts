import {Controller, Get, QueryParams} from "@tsed/common";
import {BadRequest} from "@tsed/exceptions";
import {Inject} from "@tsed/di";
import {AnilistService, MediaType} from "@anime-rss-filter/anilist";
import {Header} from "@tsed/schema";

@Controller('/user/lists')
export class UserListsController
{
    @Inject(AnilistService)
    protected anilist!: AnilistService;

    @Get()
    @Header({
        'Cache-Control': 'no-store',
    })
    async getIndex(@QueryParams('user') user: string)
    {
        if(!user)
            throw new BadRequest('User not defined');

        return this.anilist.getUserLists(user.toLowerCase(), MediaType.ANIME);
    }
}
