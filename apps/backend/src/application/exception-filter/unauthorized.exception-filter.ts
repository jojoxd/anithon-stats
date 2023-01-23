import {Catch, ExceptionFilterMethods, PlatformContext} from "@tsed/common";
import {Unauthorized} from "@tsed/exceptions";
import {AnilistUnauthorizedException} from "../../domain/exception/anilist-unauthorized.exception";
import {UnauthorizedExceptionResponse} from "@anistats/shared";

/**
 * Unauthorized exception catcher
 *
 * Maps anilist-specific unauthorized exceptions to an exception with source = "anilist"
 * So front-end can try to start re-auth with anilist
 */
@Catch(Unauthorized)
export class UnauthorizedExceptionFilter implements ExceptionFilterMethods
{
	catch(exception: Unauthorized, ctx: PlatformContext): void
	{
		const { id, response, logger } = ctx;

		const error = this.mapError(exception, id);

		logger.warn({
			error,
		});

		response
			.setHeaders(exception.headers)
			.status(401)
			.body(error);
	}

	protected mapError(exception: Unauthorized, correlationId: string): UnauthorizedExceptionResponse
	{
		const source = exception instanceof AnilistUnauthorizedException ? "anilist" : "backend"

		return {
			isError: true,

			name: exception.origin?.name ?? exception.name,
			status: 401,
			message: exception.message,
			correlationId,

			source,
		};
	}
}