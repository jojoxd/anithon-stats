import {useDecorators} from "@tsed/core";
import {UseAuth as BaseUseAuth} from "@tsed/common";

import {AuthMiddleware} from "../guard/AuthMiddleware";
import {AuthMiddlewareOptions} from "../domain/AuthMiddlewareOptions";
import {Returns} from "@tsed/schema";
import {Forbidden, InternalServerError, Unauthorized} from "@tsed/exceptions";

export const USE_AUTH_DATA_KEY = "tsed-entity-mapper:use-auth";

export function UseAuth<T>(expression: string, options?: Omit<AuthMiddlewareOptions, "expression">): MethodDecorator
{
	let _options: Partial<AuthMiddlewareOptions> = options ?? {};
	_options.expression = expression;

	return useDecorators(
		BaseUseAuth(AuthMiddleware, _options),

		Returns(401, Unauthorized).Description(_options.unauthorizedMessage ?? "Unauthorized"),
		Returns(403, Forbidden).Description(_options.forbiddenMessage ?? "Forbidden"),
		Returns(500, InternalServerError).Description("Internal Server Error"),
	);
}
