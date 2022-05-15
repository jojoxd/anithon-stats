import {useDecorators} from "@tsed/core";
import {Injectable, ProviderOpts} from "@tsed/di";

export const AUTH_CONTEXT_PROVIDER_TYPE = "tsed-auth:context-provider";

export function AuthContextProvider(options?: Partial<Exclude<ProviderOpts, "type">>): ClassDecorator
{
	options ??= {};

	options.type = AUTH_CONTEXT_PROVIDER_TYPE;

	return useDecorators(
		Injectable(options)
	);
}
