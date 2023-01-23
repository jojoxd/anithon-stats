import {EntryId, EntryStatusEnum} from "@anistats/shared";
import {Cascade, Entity, Enum, ManyToOne, OneToOne, PrimaryKey, Property, Ref} from "@mikro-orm/core";
import {ListEntity} from "../list/list.entity";
import {SeriesEntity} from "../series/series.entity";
import {EntryDataEntity} from "./entry-data.entity";
import { createId } from "../../util/create-id.fn";
import {EntryRepository} from "../../repository/entry/entry.repository";

@Entity({
	tableName: "entry",
	repository: () => EntryRepository,
})
export class EntryEntity
{
	@PrimaryKey({ type: 'varchar', length: 36, })
	public id: EntryId = createId<EntryId>();

	@ManyToOne(() => ListEntity, { ref: true, })
	public list!: Ref<ListEntity>;

	@ManyToOne(() => SeriesEntity, { ref: true, })
	public series!: Ref<SeriesEntity>;

	@OneToOne(() => EntryDataEntity, { owner: true, eager: true, cascade: [Cascade.PERSIST], orphanRemoval: true, })
	public data!: EntryDataEntity;

	@Enum({ items: () => EntryStatusEnum, type: 'varchar', })
	public state!: EntryStatusEnum;

	@Property()
	public progress!: number;
}
