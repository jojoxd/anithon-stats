import {Service} from "@tsed/di";
import {ListEntity} from "../entity/list/list.entity";
import {NotImplemented} from "@tsed/exceptions";

@Service()
export class ListImageDomainService
{
	async generateImage(list: ListEntity): Promise<Buffer>
	{
		throw new NotImplemented("Generating List Images is not implemented yet");
	}
}
