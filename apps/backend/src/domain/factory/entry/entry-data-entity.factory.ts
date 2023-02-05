import {EntryEntity} from "../../entity/entry/entry.entity";
import {EntryDataEntity} from "../../entity/entry/entry-data.entity";
import { EntryDataDefaults } from "@anistats/shared";


export class EntryDataEntityFactory
{

	static create(entryEntity?: EntryEntity): EntryDataEntity
	{
		const entryDataEntity = new EntryDataEntity();

		entryDataEntity.mult = EntryDataDefaults.MULTIPLIER;
		entryDataEntity.order = EntryDataDefaults.ORDER;
		entryDataEntity.split = EntryDataDefaults.SPLIT;
		entryDataEntity.splitSequelEntry = EntryDataDefaults.SPLIT_SEQUEL_ENTRY;
		entryDataEntity.startAt = EntryDataDefaults.START_AT;

		if (entryEntity) {
			entryDataEntity.entry = entryEntity;
			entryEntity.data = entryDataEntity;
		}

		return entryDataEntity;
	}

}
