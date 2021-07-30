import {Controller, Get, PathParams, View} from "@tsed/common";
import {Inject} from "@tsed/di";
import {AnilistService, MediaType} from "@anime-rss-filter/anilist";

@Controller("/")
export class IndexController {

  @Inject(AnilistService)
  protected anilist!: AnilistService;

  @Get("/")
  @View("index.pug")
  async getIndex() {
    return {};
  }

  @Get("/:user/lists")
  async getLists(@PathParams("user") user: string)
  {
    let lists = await this.anilist.getUserLists(user, MediaType.ANIME);

    return {
      lists: lists.map(name => ({
        name,
        url: `/${user}/list/${name}`
      })),
    };
  }
}
