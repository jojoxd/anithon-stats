import {$log, Catch, ExceptionFilterMethods, PlatformContext} from "@tsed/common";
import {Exception, InternalServerError} from "@tsed/exceptions";
import { ExceptionResponse } from "@anistats/shared";

/**
 * Generic Exception catcher
 * @TODO: Move to @jojoxd/tsed-exceptions, split out to Error and Exception
 */
@Catch(Error)
export class PlatformExceptionFilter implements ExceptionFilterMethods
{
	catch(exception: Error, ctx: PlatformContext): void
	{
		const { id, response, logger } = ctx;

		const error = this.mapError(exception, id);

		$log.error({
			exception,
			id,
		});

		response
			.setHeaders(this.getHeaders(exception))
			.status(error.status)
			.body(error);
	}

	private mapError(error: Error | Exception, correlationId: string): ExceptionResponse
	{
		let exception: Exception;

		// Typescript is weird, it apparantly does not implode the type
		// when you use `if (!(error instanceof Exception)) { error = new InternalServerError() }`,
		// it does not resolve the type of error to Exception.
		if (error instanceof Exception) {
			exception = error;
		} else {
			exception = new InternalServerError(error.message);
		}

		return {
			isError: true,

			name: exception.origin?.name ?? error.name,
			status: exception.status,
			message: exception.message,
			correlationId,
		};
	}

	private getHeaders(error: Error): { [p: string]: any; }
	{
		if (error instanceof Exception) {
			return error.headers;
		}

		return {};
	}
}
