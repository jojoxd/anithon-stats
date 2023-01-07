import {SearchGlobalResponse} from "@anistats/shared";
import {Service} from "@tsed/di";
import {NotImplemented} from "@tsed/exceptions";

@Service()
export class SearchGlobalApplicationService
{
	public async search(query: string): Promise<SearchGlobalResponse>
	{
		throw new NotImplemented("TODO: Add search through database for users and lists");
	}
}
