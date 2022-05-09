import {EntityParamOptions} from "./EntityParamOptions";
import {PlatformContext} from "@tsed/common";

export interface EntityMapperMapContext<T>
{
    ctx: PlatformContext;

    options: EntityParamOptions["options"];
}
