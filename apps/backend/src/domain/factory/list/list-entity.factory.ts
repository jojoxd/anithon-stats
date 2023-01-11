import {ListEntity} from "../../entity/list/list.entity";
import {UserEntity} from "../../entity/user/user.entity";
import {ListSettingsEntityFactory} from "./list-settings-entity.factory";

export class ListEntityFactory
{
	static create(name: string, user?: UserEntity): ListEntity
	{
		const listEntity = new ListEntity();

		listEntity.name = name;
		listEntity.entries = [];
		listEntity.settings = ListSettingsEntityFactory.create();

		if (user) {
			listEntity.user = user;
			user.lists.push(listEntity);
		}

		listEntity.createdAt = new Date();

		return listEntity;
	}
}
