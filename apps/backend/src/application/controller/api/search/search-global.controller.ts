import {Controller, Inject} from "@tsed/di";
import {Post} from "@tsed/schema";
import {SearchGlobalRequest, SearchGlobalResponse} from "@anistats/shared";
import { BodyParams, Req } from "@tsed/common";
import {SearchGlobalApplicationService} from "../../../service/search/search-global.application-service";
import { UserEntity } from "../../../../domain/entity/user/user.entity";

@Controller("/search/global")
export class SearchGlobalController
{
	@Inject()
	protected readonly searchGlobalService!: SearchGlobalApplicationService;

	@Post("/")
	async searchGlobal(
		@BodyParams() searchGlobalRequest: SearchGlobalRequest,
		@Req('user') user?: UserEntity,
	): Promise<SearchGlobalResponse>
	{
		return this.searchGlobalService.search(searchGlobalRequest.query, user);
	}
}

