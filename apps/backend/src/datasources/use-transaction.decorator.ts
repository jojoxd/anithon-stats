import {DataSource} from "typeorm";
import {IsolationLevel} from "typeorm/driver/types/IsolationLevel";

export function UseTransaction(dataSource: DataSource, isolationLevel: IsolationLevel = "READ UNCOMMITTED"): MethodDecorator
{
	return (target, propertyKey, descriptor: PropertyDescriptor) => {
		// const baseFunction = descriptor.value;
		//
		// descriptor.value = async function(...args: any[]) {
		// 	return dataSource.transaction(isolationLevel, () => {
		// 		return baseFunction.apply(this, args);
		// 	});
		// };

		return descriptor;
	};
}
