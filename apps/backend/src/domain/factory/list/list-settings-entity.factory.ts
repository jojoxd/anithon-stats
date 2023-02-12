import { ListSettingsEntity } from "../../entity/list/list-settings.entity";
import { ListSettingsDefaults } from "@anistats/shared";

export class ListSettingsEntityFactory
{
	static create()
	{
		const listSettingsEntity = new ListSettingsEntity();

		// Set defaults
		listSettingsEntity.stackSize = ListSettingsDefaults.STACK_SIZE;

		listSettingsEntity.allowChunkMerge = ListSettingsDefaults.ALLOW_CHUNK_MERGE;

		listSettingsEntity.maxChunkLength = ListSettingsDefaults.MAX_CHUNK_LENGTH;
		listSettingsEntity.maxChunkJoinLength = ListSettingsDefaults.MAX_CHUNK_JOIN_LENGTH;

		return listSettingsEntity;
	}
}
