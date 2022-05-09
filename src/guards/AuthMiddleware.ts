import {Middleware, MiddlewareMethods, Req, Context, Session, Inject, UseAuth} from "@tsed/common";
import {AnilistService} from "@anime-rss-filter/anilist";
import {useDecorators} from "@tsed/core";
import jexl from "jexl";
import {Forbidden, Unauthorized} from "@tsed/exceptions";
import {Returns} from "@tsed/schema";

@Middleware()
export class AuthMiddleware implements MiddlewareMethods
{
    @Inject()
    protected anilistService!: AnilistService;

    public async use(@Req() request: Req, @Context() ctx: Context)
    {
        const options = ctx.endpoint.get(AuthMiddleware) as AuthMiddlewareOptions;

        const currentUser = await this.anilistService.getCurrentUser();

        if(!currentUser) {
            throw new Unauthorized("Unauthorized");
        }

        const session = ctx.getRequest().session;
        const pathParams = ctx.getRequest().params;
        const queryParams = ctx.getRequest().query;

        const bool = await jexl.eval(options.expression, { currentUser, ctx, session, pathParams, queryParams });

        // If expression is not true
        if(!bool) {
            throw new Forbidden("Forbidden");
        }
    }
}

interface AuthMiddlewareOptions extends Record<string, unknown>
{
    expression: string;
}

export function CustomAuth(expression: string): Function
{
    return useDecorators(
        UseAuth(AuthMiddleware, { expression }),

        Returns(401, Unauthorized).Description("Unauthorized"),
        Returns(403, Forbidden).Description("Forbidden"),
    );
}