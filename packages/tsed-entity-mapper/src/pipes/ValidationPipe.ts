import {PipeMethods, ValidationPipe as BaseValidationPipe} from "@tsed/platform-params";
import {OverrideProvider} from "@tsed/di";
import {JsonParameterStore} from "@tsed/schema";
import {EntityMapperPipe} from "./EntityMapperPipe";

@OverrideProvider(BaseValidationPipe)
export class ValidationPipe extends BaseValidationPipe implements PipeMethods
{
    public override async transform(value: any, metadata: JsonParameterStore): Promise<any>
    {
        const entityMapperPipe = metadata.pipes.find(pipe => pipe === EntityMapperPipe);

        if(entityMapperPipe) {
            // console.log("VP val ->", value);

            return value;
        }

        return super.transform(value, metadata);
    }
}
