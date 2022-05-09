import {useDecorators} from "@tsed/core";
import {RawQueryParams, UsePipe} from "@tsed/platform-params";

import {EntityMapperPipe} from "../../pipes/EntityMapperPipe";
import {EntityParamOptions} from "../../domain/EntityParamOptions";

export function QueryParamEntity<T>(expression: string, options: EntityParamOptions): ParameterDecorator
{
    return useDecorators(
        RawQueryParams(expression),
        UsePipe(EntityMapperPipe, options),
    );
}
