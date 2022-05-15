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
import {inspect} from "util";

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
	}

	get contextProviders(): Array<AuthContextProviderInterface>
	{
		return this.injector.getAll(AUTH_CONTEXT_PROVIDER_TYPE);
	}

	async buildContext(context: Context)
	{
		const contextProviderContext: any = {};

		for(const contextProvider of this.contextProviders) {
			this.logger.debug(`[AuthMiddleware]: Get Context from ${Object.getPrototypeOf(contextProvider)?.name}`);

			Object.assign(contextProviderContext, await contextProvider.getContext());
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

			this.logger.info(`[AuthMiddleware]: Inspection of expressionContext:`);
			this.logger.info(inspect(expressionContext, { depth: 3, colors: true }));

			isAuthenticated = await this.expressionEvaluator.eval(options.expression, expressionContext);
		} catch (e) {
			this.logger.error(e);

			throw new InternalServerError("Could not authorize route", this.env === Env.DEV ? e : null);
		}

		if (typeof isAuthenticated !== "boolean")
			throw new Unauthorized(options.unauthorizedMessage ?? "");

		if (!isAuthenticated)
			throw new Forbidden(options.forbiddenMessage ?? "");
	}
}
