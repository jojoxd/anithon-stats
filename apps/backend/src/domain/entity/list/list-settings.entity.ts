import {ListSettingsRepository} from "../../repository/list/list-settings.repository";
import {Entity, PrimaryKey, Property} from "@mikro-orm/core";
import { v4 as uuid4 } from "uuid";

@Entity({
	tableName: "list_settings",
	repository: () => ListSettingsRepository,
})
export class ListSettingsEntity
{
	@PrimaryKey({ type: 'varchar', length: 36, })
	public id: string = uuid4();

	@Property()
	public allowChunkMerge!: boolean;

	@Property()
	public maxChunkLength!: number;

	@Property()
	public maxChunkJoinLength!: number;
}
