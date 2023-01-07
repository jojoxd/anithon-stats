import {SeriesId, SeriesTitleDto} from "@anistats/shared";
import {Column, Entity, Generated, JoinTable, ManyToMany, OneToMany, PrimaryColumn} from "typeorm";
import {EntryEntity} from "../entry/entry.entity";

@Entity("series")
export class SeriesEntity
{
	@PrimaryColumn("uuid")
	@Generated("uuid")
	public id!: SeriesId;

	@Column("simple-json")
	public anilistId!: any;

	@Column("simple-json")
	public title!: SeriesTitleDto;

	@Column()
	public coverImage!: string;

	@Column()
	public duration!: number;

	@Column({ type: 'int', nullable: true })
	public episodes!: number | null;

	@Column({ type: 'text', nullable: true })
	public description!: string | null;

	@OneToMany(() => EntryEntity, (entry) => entry.list)
	public entries!: Array<EntryEntity>;

	@ManyToMany(() => SeriesEntity, (series) => series.prequels)
	@JoinTable({ name: "series_sequels" })
	public sequels!: Array<SeriesEntity>;

	@ManyToMany(() => SeriesEntity, (series) => series.sequels)
	public prequels!: Array<SeriesEntity>;
}
