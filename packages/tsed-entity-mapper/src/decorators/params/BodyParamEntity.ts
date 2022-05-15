import {useDecorators} from "@tsed/core";
import {BodyParams, UsePipe} from "@tsed/platform-params";

import {EntityMapperPipe} from "../../pipes/EntityMapperPipe";
import {EntityParamOptions} from "../../domain/EntityParamOptions";

/**
 * Convert a Body Parameter to an Entity
 */
export function BodyParamEntity<T>(expression?: string, options?: EntityParamOptions): ParameterDecorator
{
    let paramDecorator = BodyParams();

    if(typeof expression !== "undefined") {
        paramDecorator = BodyParams(expression);
    }

    // @TODO: Check if we need to use BodyParams(expression) or RawBodyParams() here
    return useDecorators(
        paramDecorator,
        UsePipe(EntityMapperPipe, options),
    );
}
