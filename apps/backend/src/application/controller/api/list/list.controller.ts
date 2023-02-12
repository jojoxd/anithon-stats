import {ContentType, Get, Post} from "@tsed/schema";
import {Controller, Inject} from "@tsed/di";
import {ListResponse, UpdateListRequest, BaseResponse, ListId} from "@anistats/shared";
import {BodyParams, PathParams} from "@tsed/common";
import {UseCache} from "@tsed/platform-cache";
import {ListApplicationService} from "../../../service/list.application-service";
import {Authorize} from "@tsed/passport";

@Controller("/list")
export class ListController
{
	@Inject()
	protected listService!: ListApplicationService;

	@Get("/:listId")
	@ContentType("application/json")
	async getList(@PathParams('listId') listId: ListId): Promise<ListResponse>
	{
		return this.listService.getList(listId);
	}

	@Post("/update")
	@Authorize("jwt")
	async updateList(@BodyParams() updateListRequest: UpdateListRequest): Promise<BaseResponse>
	{
		// @TODO: Auth

		await this.listService.updateList(updateListRequest);

		// @TODO: Handle using PlatformException / base controller?
		return {
			status: 200,
			message: "OK",
		};
	}

	@Get("/:listId/image.png")
	@ContentType('image/png')
	@UseCache({ ttl: 300 })
	async getListImage(@PathParams("listId") listId: ListId): Promise<any>
	{
		return this.listService.generateListImage(listId);
	}
}
