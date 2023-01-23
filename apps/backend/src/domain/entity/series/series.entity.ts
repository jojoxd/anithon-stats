import {AnilistSeriesId, SeriesId, SeriesTitleDto} from "@anistats/shared";
import {EntryEntity} from "../entry/entry.entity";
import {Collection, Entity, ManyToMany, OneToMany, PrimaryKey, Property,} from "@mikro-orm/core";
import {SeriesRepository} from "../../repository/series/series.repository";
import { createId } from "../../util/create-id.fn";

@Entity({
	tableName: "series",
	repository: () => SeriesRepository,
})
export class SeriesEntity
{
	@PrimaryKey({ type: 'varchar', length: 36, })
	public id: SeriesId = createId<SeriesId>();

	@Property({ type: 'json', })
	public anilistId!: AnilistSeriesId;

	@Property({ type: 'json', })
	public title!: SeriesTitleDto;

	@Property({ nullable: true, })
	public coverImage?: string;

	@Property()
	public duration!: number;

	@Property({ nullable: true, })
	public episodes?: number;

	@Property({ type: 'longtext', columnType: 'longtext', nullable: true, })
	public description?: string;

	@OneToMany(() => EntryEntity, (entry) => entry.series)
	public entries = new Collection<EntryEntity>(this);

	@ManyToMany(() => SeriesEntity, (series) => series.prequels)
	public sequels = new Collection<SeriesEntity>(this);

	@ManyToMany(() => SeriesEntity)
	public prequels = new Collection<SeriesEntity>(this);

	@Property()
	public createdAt: Date = new Date();

	@Property({ nullable: true, })
	public synchronizedAt?: Date;
}
