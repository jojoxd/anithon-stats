import {EntityManager, EntityName} from "@mikro-orm/core";
import {ProviderScope} from "@tsed/common";
import {Type} from "@tsed/core";
import {registerProvider} from "@tsed/di";
import {EntityRepository} from "./entity-repository";
import {MikroOrmContext} from "@tsed/mikro-orm";
import {Logger} from "@tsed/logger";

export function registerEntityRepository<T extends object>(
	getEntityName: () => EntityName<T>,
	repository: Type<EntityRepository<T>>,
	contextName?: string,
) {
	console.log('registerEntityRepository', { getEntityName, repository });

	// registerProvider({
	// 	type: 'entity-repository',
	// 	provide: repository,
	//
	// 	scope: ProviderScope.INSTANCE,
	//
	// 	deps: [
	// 		MikroOrmContext,
	// 		Logger,
	// 	],
	//
	// 	useFactory: (context: MikroOrmContext, logger: Logger): EntityRepository<T> | null => {
	// 		const entityName = getEntityName();
	//
	// 		logger.info(`Creating MikroOrm EntityRepository`, { repository, entityName });
	//
	// 		const entityManager = context.get(contextName);
	//
	// 		return entityManager?.getRepository(entityName) ?? null;
	// 	},
	// });
}
