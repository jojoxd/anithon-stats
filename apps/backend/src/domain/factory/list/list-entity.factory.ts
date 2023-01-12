import {ListEntity} from "../../entity/list/list.entity";
import {UserEntity} from "../../entity/user/user.entity";
import {ListSettingsEntityFactory} from "./list-settings-entity.factory";
import {Reference} from "@mikro-orm/core";

export class ListEntityFactory
{
	static create(name: string, user?: UserEntity): ListEntity
	{
		const listEntity = new ListEntity();

		listEntity.name = name;
		listEntity.settings = ListSettingsEntityFactory.create();

		if (user) {
			listEntity.user = Reference.create(user);
			user.lists.add(listEntity);
		}

		listEntity.createdAt = new Date();

		return listEntity;
	}
}
