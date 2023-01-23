import {JwtConfiguration} from "./domain/interface/jwt-configuration.interface";

declare global
{
	namespace TsED
	{
		interface Configuration
		{
			jwt: JwtConfiguration;
		}
	}
}
