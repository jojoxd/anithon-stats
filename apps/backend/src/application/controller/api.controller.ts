import {InjectContext} from "@tsed/di";
import {Context} from "@tsed/common";

export abstract class ApiController
{
	@InjectContext()
	private $ctx?: Context;

	redirect(path: string, code: 301 | 302)
	{
		this.$ctx?.response.redirect(code, path);
	}

	setCookie(name: string, value: string, opts?: TsED.SetCookieOpts)
	{
		this.$ctx?.response.cookie(name, value, opts);
	}
}