import {useDecorators} from "@tsed/core";
import {Authorize} from "@tsed/passport";
import {Security} from "@tsed/schema";

export function JwtSecurity(): MethodDecorator
{
	return useDecorators(
		Authorize("jwt"),
		Security("jwt"),
		// Returns(401, ErrorResponse).Description("When not authorized"),
	);
}
