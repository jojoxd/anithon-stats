import {ParamOptions} from "@tsed/platform-params";

declare module "@tsed/common"
{
    export function Session(expression: string): ParameterDecorator;
    export function Session(options: Partial<ParamOptions>): ParameterDecorator;
    export function Session(): ParameterDecorator;

    export interface Session
    {
        test: string;
    }
}
