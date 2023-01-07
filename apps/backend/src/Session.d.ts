import {ParamOptions} from "@tsed/platform-params";
import {UserId} from "@anistats/shared";
import {Session as ExpressSession} from "express-session";

declare module "@tsed/common"
{
    export function Session(expression: string): ParameterDecorator;
    export function Session(options: Partial<ParamOptions>): ParameterDecorator;
    export function Session(): ParameterDecorator;

    export interface Session extends ExpressSession
    {
        userId?: UserId;

		anilistToken?: string;

        anilistConnector?: {
        	redirectNext?: string;
		};
    }
}
