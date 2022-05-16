import {PipeMethods, DeserializerPipe as BaseDeserializerPipe} from "@tsed/platform-params";
import {OverrideProvider} from "@tsed/di";
import {JsonParameterStore} from "@tsed/schema";
import {EntityMapperPipe} from "./EntityMapperPipe";

@OverrideProvider(BaseDeserializerPipe)
export class DeserializerPipe extends BaseDeserializerPipe implements PipeMethods
{
    public override async transform(value: any, metadata: JsonParameterStore): Promise<any>
    {
        const entityMapperPipe = metadata.pipes.find(pipe => pipe === EntityMapperPipe);

        if(entityMapperPipe) {
            // console.log("DP val ->", value);

            return value;
        }

        return super.transform(value, metadata);
    }
}
