import {Column, Entity, Generated, OneToOne, PrimaryColumn} from "typeorm";
import {EntryEntity} from "./entry.entity";

@Entity("entry_data")
export class EntryDataEntity
{
	@PrimaryColumn("uuid")
	@Generated("uuid")
	public id!: string;

	@OneToOne(() => EntryEntity, (entry) => entry.data)
	public entry!: EntryEntity;

	@Column({ default: 1, })
	public mult!: number;

	@Column()
	public order!: number;

	@Column({ type: 'int', nullable: true, })
	public startAt!: number | null;

	@Column({ type: 'int', nullable: true, })
	public split!: number | null;

	@Column({ default: false })
	public splitSequelEntry!: boolean;
}
