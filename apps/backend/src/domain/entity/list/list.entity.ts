import {Column, Entity, Generated, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn} from "typeorm";
import {ListId} from "@anistats/shared";
import {ListSettingsEntity} from "./list-settings.entity";
import {UserEntity} from "../user/user.entity";
import {EntryEntity} from "../entry/entry.entity";

@Entity("list")
export class ListEntity
{
	@PrimaryColumn("uuid")
	@Generated("uuid")
	public id!: ListId;

	@Column()
	public name!: string;

	@ManyToOne(() => UserEntity, (user) => user.lists, { eager: true })
	@JoinColumn({ name: "user_id", })
	public user!: UserEntity;

	@OneToOne(() => ListSettingsEntity, { eager: true, cascade: true, })
	@JoinColumn({ name: "settings_id", })
	public settings!: ListSettingsEntity;

	@OneToMany(() => EntryEntity, (entry) => entry.list)
	public entries!: Array<EntryEntity>;
}
