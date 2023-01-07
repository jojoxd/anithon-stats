import {Get} from "@tsed/schema";
import {Controller, Inject, InjectContext} from "@tsed/di";
import {Context, QueryParams, Session} from "@tsed/common";
import {AnilistConnectorApplicationService} from "../../../application/service/anilist-connector.application-service";

@Controller(AnilistConnectorApplicationService.CONTROLLER_ROUTE)
export class AnilistConnectorController
{
	@Inject()
	protected readonly anilistConnectorService!: AnilistConnectorApplicationService;

	@InjectContext()
	protected readonly context!: Context;

	@Get("/")
	public getIndex(
		@QueryParams("redirect") redirectTo: string,
		@Session() session: Session,
	) {
		return this.anilistConnectorService.startAuthorize(
			redirectTo,
			this.context,
			session,
		);
	}

	@Get(AnilistConnectorApplicationService.INGEST_ROUTE)
	public async getIngest(
		@QueryParams("code") code: string,
		@Session() session: Session,
	) {
		return this.anilistConnectorService.finishAuthorize(
			code,
			this.context,
			session,
		);
	}
}
