import {useDecorators} from "@tsed/core";
import {BodyParams, UsePipe, ParamOptions} from "@tsed/platform-params";

import {EntityMapperPipe} from "../../pipes/EntityMapperPipe";
import {EntityParamOptions} from "../../domain/EntityParamOptions";

/**
 * Convert a Body Parameter to an Entity
 */
export function BodyParamEntity<T>(options?: Partial<EntityParamOptions & ParamOptions<T>>): ParameterDecorator
{
	// Provide sane defaults
	options ??= {};
	options.useValidation ??= false;
	options.useMapper ??= false;
	options.useConverter ??= false;

	let paramDecorator = BodyParams(options as ParamOptions<T>);

    // @TODO: Check if we need to use BodyParams(expression) or RawBodyParams() here
    return useDecorators(
        paramDecorator,
        UsePipe(EntityMapperPipe, options),
    );
}
