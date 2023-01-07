import {DataSource} from "typeorm";

export function UseTransaction(dataSource: DataSource): MethodDecorator
{
	return (target, propertyKey, descriptor: PropertyDescriptor) => {
		const baseFunction = descriptor.value;

		descriptor.value = async (...args: any[]) => {
			return dataSource.transaction(() => {
				return baseFunction.apply(target, args);
			});
		};

		return descriptor;
	};
}
