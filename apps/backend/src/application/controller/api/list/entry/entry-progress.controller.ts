import {BodyParams, Controller, PathParams} from "@tsed/common";
import {Authorize} from "@tsed/passport";
import {EntryApplicationService} from "../../../../service/entry.application-service";
import {ListId, BaseResponse, UpdateEntryProgressRequest} from "@anistats/shared";
import {ContentType, Post} from "@tsed/schema";
import {Inject} from "@tsed/di";

@Controller('/list/:listId/entry')
export class EntryProgressController
{
	@Inject()
	protected entryService!: EntryApplicationService;
	
	@Post('/update')
	@ContentType("application/json")
	@Authorize("jwt")
	async updateEntryProgress(
		@PathParams('listId') listId: ListId,
		@BodyParams() updateEntryProgressRequest: UpdateEntryProgressRequest
	): Promise<BaseResponse> {
		// @TODO: Auth
		
		await this.entryService.updateProgress(updateEntryProgressRequest);
		
		return {
			status: 200,
			message: "OK",
		};
	}
}