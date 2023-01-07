import {Column, Entity, Generated, JoinColumn, ManyToOne, OneToOne, PrimaryColumn} from "typeorm";
import {EntryId, EntryStatusEnum} from "@anistats/shared";
import {ListEntity} from "../list/list.entity";
import {SeriesEntity} from "../series/series.entity";
import {EntryDataEntity} from "./entry-data.entity";

@Entity("entry")
export class EntryEntity
{
	@PrimaryColumn("uuid")
	@Generated("uuid")
	public id!: EntryId;

	@ManyToOne(() => ListEntity, (list) => list.entries)
	@JoinColumn({ name: "list_id", })
	public list!: ListEntity;

	@ManyToOne(() => SeriesEntity, (series) => series.entries)
	@JoinColumn({ name: "series_id", })
	public series!: SeriesEntity;

	@OneToOne(() => EntryDataEntity, (data) => data.entry)
	public data!: EntryDataEntity;

	@Column({
		type: 'simple-enum',
		enum: EntryStatusEnum,
	})
	public state!: EntryStatusEnum;

	@Column({ default: 0, })
	public progress!: number;
}
