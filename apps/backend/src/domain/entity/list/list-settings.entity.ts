import {Column, Entity, Generated, PrimaryColumn} from "typeorm";
import {ListId} from "@anistats/shared";

@Entity("list_settings")
export class ListSettingsEntity
{
	@PrimaryColumn("uuid")
	@Generated("uuid")
	public id!: string;

	@Column()
	public allowChunkMerge!: boolean;

	@Column()
	public maxChunkLength!: number;

	@Column()
	public maxChunkJoinLength!: number;
}
