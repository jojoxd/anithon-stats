import {ListId} from "@anistats/shared";
import {ListSettingsEntity} from "./list-settings.entity";
import {UserEntity} from "../user/user.entity";
import {EntryEntity} from "../entry/entry.entity";
import {ListRepository} from "../../repository/list/list.repository";
import {Cascade, Collection, Entity, ManyToOne, OneToMany, OneToOne, PrimaryKey, Property, Ref} from "@mikro-orm/core";
import { v4 as uuid4 } from "uuid";

@Entity({
	tableName: "list",
	repository: () => ListRepository,
})
export class ListEntity
{
	@PrimaryKey({ type: 'varchar', length: 36, })
	public id: ListId = uuid4() as any as ListId;

	@Property()
	public name!: string;

	@ManyToOne(() => UserEntity, { ref: true, })
	public user!: Ref<UserEntity>;

	@OneToOne(() => ListSettingsEntity, { eager: true, cascade: [Cascade.PERSIST], })
	public settings!: ListSettingsEntity;

	@OneToMany(() => EntryEntity, (entry) => entry.list, { orphanRemoval: true, cascade: [Cascade.PERSIST], })
	public entries = new Collection<EntryEntity>(this);

	@Property()
	public createdAt!: Date;

	@Property({ nullable: true, })
	public synchronizedAt?: Date;
}
