import {useDecorators} from "@tsed/core";
import {Injectable, ProviderOpts, ProviderScope} from "@tsed/di";

export const AUTH_CONTEXT_PROVIDER_TYPE = "tsed-auth:context-provider";

export function AuthContextProvider(options?: Partial<Exclude<ProviderOpts, "type"|"scope">>): ClassDecorator
{
	options ??= {};

	options.type = AUTH_CONTEXT_PROVIDER_TYPE;
	// options.scope = ProviderScope.REQUEST;

	return useDecorators(
		Injectable(options)
	);
}
