import { ProviderOpts } from '@tsed/di';
import { MiddlewareMethods, InjectorService, Logger, Context, Req } from '@tsed/common';
import * as jexl from 'jexl';
import { Env } from '@tsed/core';

declare const AUTH_CONTEXT_PROVIDER_TYPE = "tsed-auth:context-provider";
declare function AuthContextProvider(options?: Partial<Exclude<ProviderOpts, "type">>): ClassDecorator;

interface AuthMiddlewareOptions {
    expression: string;
    unauthorizedMessage?: string;
    forbiddenMessage?: string;
}

declare const USE_AUTH_DATA_KEY = "tsed-entity-mapper:use-auth";
declare function UseAuth<T>(expression: string, options?: Omit<AuthMiddlewareOptions, "expression">): MethodDecorator;

interface AuthContextProviderInterface {
    getContext(): Promise<any>;
}

declare class AuthMiddleware implements MiddlewareMethods {
    protected readonly expressionEvaluator: InstanceType<typeof jexl.Jexl>;
    protected readonly injector: InjectorService;
    protected readonly logger: Logger;
    protected readonly env: Env;
    constructor();
    get contextProviders(): Array<AuthContextProviderInterface>;
    buildContext(context: Context): Promise<any>;
    use(request: Req, ctx: Context): Promise<void>;
}

export { AUTH_CONTEXT_PROVIDER_TYPE, AuthContextProvider, AuthContextProviderInterface, AuthMiddleware, AuthMiddlewareOptions, USE_AUTH_DATA_KEY, UseAuth };
