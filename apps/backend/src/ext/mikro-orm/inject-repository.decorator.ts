import {Inject} from "@tsed/di";
import {MikroOrmContext} from "@tsed/mikro-orm";
import {EntityName} from "@mikro-orm/core";

/**
 * Inject a MikroORM Repository into a service
 *
 * @TODO: Move to new package: @jojoxd/tsed-util/mikro-orm
 *
 * @NOTE: This most likely does not work with Transactional, needs to be tested
 *
 * ```typescript
 * @Entity({ repository: () => MyRepository, })
 * export class MyEntity {}
 *
 * @Injectable()
 * export class MyService {
 *     @InjectRepository(MyEntity)
 *     entityRepository!: MyRepository;
 * }
 * ```
 */
export function InjectRepository<T extends object>(entityName: EntityName<T>, contextName?: string): Function
{
	return Inject(MikroOrmContext, (context: MikroOrmContext) => {
		return context.get(contextName)!.getRepository<T>(entityName);
	});
}
