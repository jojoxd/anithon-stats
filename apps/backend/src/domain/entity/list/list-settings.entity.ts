import {ListSettingsRepository} from "../../repository/list/list-settings.repository";
import {Entity, PrimaryKey, Property} from "@mikro-orm/core";
import { createId } from "../../util/create-id.fn";

@Entity({
	tableName: "list_settings",
	repository: () => ListSettingsRepository,
})
export class ListSettingsEntity
{
	@PrimaryKey({ type: 'varchar', length: 36, })
	public id: string = createId();

	@Property()
	public stackSize!: number;

	@Property()
	public allowChunkMerge!: boolean;

	@Property()
	public maxChunkLength!: number;

	@Property()
	public maxChunkJoinLength!: number;
}
