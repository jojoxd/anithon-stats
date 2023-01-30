import {EntryEntity} from "../../entity/entry/entry.entity";
import {EntryDataEntity} from "../../entity/entry/entry-data.entity";

export class EntryDataEntityFactory
{

	static create(entryEntity?: EntryEntity): EntryDataEntity
	{
		const entryDataEntity = new EntryDataEntity();

		entryDataEntity.splitSequelEntry = false;
		entryDataEntity.order = -1;
		entryDataEntity.mult = 1;

		if (entryEntity) {
			entryDataEntity.entry = entryEntity;
			entryEntity.data = entryDataEntity;
		}

		return entryDataEntity;
	}

}
