import {EntryEntity} from "./entry.entity";
import {Entity, OneToOne, PrimaryKey, Property, Ref} from "@mikro-orm/core";
import {EntryDataRepository} from "../../repository/entry/entry-data.repository";
import { createId } from "../../util/create-id.fn";

@Entity({
	tableName: "entry_data",
	repository: () => EntryDataRepository,
})
export class EntryDataEntity
{
	@PrimaryKey({ type: 'varchar', length: 36, })
	public id: string = createId();

	@OneToOne(() => EntryEntity, { eager: true, mappedBy: 'data', })
	public entry!: EntryEntity;

	@Property({ type: 'int', precision: 1, })
	public mult!: number;

	@Property({ nullable: true, })
	public order?: number | null;

	@Property({ nullable: true, })
	public startAt?: number | null;

	@Property({ nullable: true, })
	public split?: number | null;

	@Property()
	public splitSequelEntry!: boolean;
}
