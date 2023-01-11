import {ListSettingsEntity} from "../../entity/list/list-settings.entity";

export class ListSettingsEntityFactory
{

	static create()
	{
		const listSettingsEntity = new ListSettingsEntity();

		// Set defaults
		listSettingsEntity.allowChunkMerge = true;

		listSettingsEntity.maxChunkLength = 10;
		listSettingsEntity.maxChunkJoinLength = 10;

		return listSettingsEntity;
	}

}
