import {
	Middleware,
	MiddlewareMethods,
	Req,
	Context,
	Inject,
	InjectorService,
	Logger, Constant
} from "@tsed/common";
import * as jexl from "jexl";
import {AuthMiddlewareOptions} from "../domain/AuthMiddlewareOptions";
import {Forbidden, InternalServerError, Unauthorized} from "@tsed/exceptions";
import {AuthContextProviderInterface} from "../interfaces/AuthContextProviderInterface";
import {AUTH_CONTEXT_PROVIDER_TYPE} from "../decorator/AuthContextProvider";
import {Env} from "@tsed/core";

@Middleware()
export class AuthMiddleware implements MiddlewareMethods
{
	protected readonly expressionEvaluator: InstanceType<typeof jexl.Jexl>;

	@Inject()
	protected readonly injector!: InjectorService;

	@Inject()
	protected readonly logger!: Logger;

	@Constant("env")
	protected readonly env!: Env;

	constructor()
	{
		this.expressionEvaluator = new jexl.Jexl();

		// @NOTE: Disable assignment (@TODO: Is this needed?)
		this.expressionEvaluator.removeOp("=");

		this.expressionEvaluator.addTransform("exists", (val: any) => {
			return typeof val !== "undefined" && val !== null;
		});
	}

	get contextProviders(): Array<AuthContextProviderInterface>
	{
		return this.injector.getAll(AUTH_CONTEXT_PROVIDER_TYPE);
	}

	protected getProtoName(obj: any): string
	{
		if(typeof obj === "undefined")
			return "undefined";

		if(obj === null)
			return "null";

		return Object.getPrototypeOf(obj).name ?? typeof obj;
	}

	async buildContext(context: Context)
	{
		const contextProviderContext: any = {};

		this.logger.info("[AuthMiddleware]: Providers: ", this.contextProviders);

		for(const contextProvider of this.contextProviders) {
			this.logger.info(`[AuthMiddleware]: Get Context from ${this.getProtoName(contextProvider)}`);

			Object.assign(contextProviderContext, await contextProvider.getContext(context));
		}

		return {
			...contextProviderContext,

			routeParams: context.request.params,
			queryParams: context.request.query,
			session: context.request.session,
			cookies: context.request.cookies,

			request: context.request,
		};
	}

	async use(@Req() request: Req, @Context() ctx: Context): Promise<void> {
		this.logger.info(`[AuthMiddleware]: Running for ${ctx.request.url}`);

		const options = ctx.endpoint.get(AuthMiddleware) as AuthMiddlewareOptions;

		let isAuthenticated: any = false;
		try {
			const expressionContext = await this.buildContext(ctx);

			this.logger.info(`[AuthMiddleware]: Context build, going to evaluate "${options.expression}"`);

			isAuthenticated = await this.expressionEvaluator.eval(options.expression, expressionContext);
		} catch (e) {
			this.logger.error(e);

			throw new InternalServerError("Could not authorize route", this.env === Env.DEV ? e : null);
		}

		if (typeof isAuthenticated !== "boolean") {
			this.logger.warn(`[AuthMiddleware]: The return value of expression "${options.expression}" on "${ctx.request.url}" was not a boolean (was ${this.getProtoName(isAuthenticated)})`);

			this.logger.info(`[AuthMiddleware]: Value of expression is:\n`, isAuthenticated);

			throw new Unauthorized(options.unauthorizedMessage ?? "");
		}

		if (!isAuthenticated)
			throw new Forbidden(options.forbiddenMessage ?? "");
	}
}
