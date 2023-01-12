// import {Column, Entity, Generated, OneToOne, PrimaryColumn} from "typeorm";
import {EntryEntity} from "./entry.entity";
import {Entity, OneToOne, PrimaryKey, Property, Ref} from "@mikro-orm/core";
import {EntryDataRepository} from "../../repository/entry/entry-data.repository";
import { v4 as uuid4 } from "uuid";

@Entity({
	tableName: "entry_data",
	repository: () => EntryDataRepository,
})
export class EntryDataEntity
{
	@PrimaryKey({ type: 'varchar', length: 36, })
	public id: string = uuid4();

	@OneToOne(() => EntryEntity, { eager: true, mappedBy: 'data', })
	public entry!: EntryEntity;

	@Property({ type: 'int', precision: 1, })
	public mult!: number;

	@Property()
	public order!: number;

	@Property({ nullable: true, })
	public startAt?: number;

	@Property({ nullable: true, })
	public split?: number;

	@Property()
	public splitSequelEntry: boolean = false;
}
