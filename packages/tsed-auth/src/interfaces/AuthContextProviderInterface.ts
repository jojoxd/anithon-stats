import {Context} from "@tsed/platform-params";

export interface AuthContextProviderInterface
{
	getContext(context: Context): Promise<any>;
}
