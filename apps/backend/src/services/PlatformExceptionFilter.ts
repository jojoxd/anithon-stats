import {Catch, ExceptionFilterMethods, PlatformContext} from "@tsed/common";
import { Exception } from "@tsed/exceptions";

@Catch(Error)
export class PlatformExceptionFilter implements ExceptionFilterMethods
{
	catch(exception: Error, ctx: PlatformContext): void
	{
		const { id, response, logger } = ctx;

		const error = this.mapError(exception, id);

		logger.error({
			error,
		});

		response
			.setHeaders(this.getHeaders(exception))
			.status(error.status)
			.body(error);
	}

	private mapError(error: any, correlationId: any): any
	{
		return {
			name: error.origin?.name || error.name,
			message: typeof error.status !== "undefined" ? error.message : "Internal Server Error",
			status: error.status || 500,
			correlation: correlationId,
		};
	}

	private getHeaders(error: Error): any
	{
		if (error instanceof Exception) {
			return error.headers;
		}

		return {};
	}
}
