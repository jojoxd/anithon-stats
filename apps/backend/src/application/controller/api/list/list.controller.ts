import {ContentType, Get, Post} from "@tsed/schema";
import {Controller, Inject} from "@tsed/di";
import {ListResponse, UpdateListRequest, BaseResponse, ListId} from "@anistats/shared";
import {BodyParams, PathParams, QueryParams} from "@tsed/common";
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
	@UseCache({ ttl: 300, })
	async getListImagePNG(
		@PathParams("listId") listId: ListId,
		@QueryParams("embed") embed: boolean,
		@QueryParams("with-stats") withStats: boolean,
	): Promise<Buffer> {
		const canvas = await this.listService.generateListImage(listId, { embed, withStats, });

		return canvas.getNodeCanvas().toBuffer('image/png');
	}

	@Get("/:listId/image.svg")
	@ContentType('image/svg+xml')
	@UseCache({ ttl: 300 })
	async getListImageSVG(
		@PathParams("listId") listId: ListId,
		@QueryParams("embed") embed: boolean,
		@QueryParams("with-stats") withStats: boolean,
	): Promise<string> {
		const canvas = await this.listService.generateListImage(listId, { embed, withStats, });

		// @ts-expect-error TS2554: Incorrect typing
		return canvas.toSVG();
	}
}
