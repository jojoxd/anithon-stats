import {useDecorators} from "@tsed/core";
import {RawPathParams, UsePipe} from "@tsed/platform-params";

import {EntityMapperPipe} from "../../pipes/EntityMapperPipe";
import {EntityParamOptions} from "../../domain/EntityParamOptions";

export function PathParamEntity<T>(expression: string, options?: EntityParamOptions): ParameterDecorator
{
    return useDecorators(
        RawPathParams(expression),
        UsePipe(EntityMapperPipe, options),
    );
}