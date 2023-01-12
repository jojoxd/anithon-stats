import {EntityName} from "@mikro-orm/core";
import {registerEntityRepository} from "./register-entity-repository.fn";
import {useDecorators} from "@tsed/core";
import {Injectable, ProviderScope} from "@tsed/di";

export function Repository<T extends object>(getEntityName: () => EntityName<T>): ClassDecorator
{
	return useDecorators(
		Injectable({
			scope: ProviderScope.INSTANCE
		}),
	);

	// return (repository: any) => {
	// 	registerEntityRepository(getEntityName, repository);
	//
	// 	return repository;
	// }
}
