import {Inject} from "@tsed/di";
import {MikroOrmContext} from "@tsed/mikro-orm";
import {EntityName} from "@mikro-orm/core";

export function InjectRepository<T extends object>(entityName: EntityName<T>, contextName?: string): Function
{
	return Inject(MikroOrmContext, (context: MikroOrmContext) => {
		return context.get(contextName)!.getRepository<T>(entityName);
	});
}
