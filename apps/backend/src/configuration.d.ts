import {JwtConfiguration} from "./domain/interface/jwt-configuration.interface";
import {AppConfiguration} from "./domain/interface/app-configuration.interface";

declare global
{
	namespace TsED
	{
		interface Configuration
		{
			jwt: JwtConfiguration;

			app: AppConfiguration;
		}
	}
}
