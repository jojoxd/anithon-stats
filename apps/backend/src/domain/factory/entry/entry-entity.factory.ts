import { EntryEntity } from "../../entity/entry/entry.entity";
import { ListEntity } from "../../entity/list/list.entity";
import { SeriesEntity } from "../../entity/series/series.entity";
import {Reference} from "@mikro-orm/core";
import {EntryDto, EntryStatusEnum} from "@anistats/shared";
import {EntryDataEntityFactory} from "./entry-data-entity.factory";

export class EntryEntityFactory
{
	public static create(listEntity?: ListEntity, seriesEntity?: SeriesEntity): EntryEntity
	{
		const entryEntity = new EntryEntity();

		if(listEntity) {
			entryEntity.list = Reference.create(listEntity);

			if(listEntity.entries.isInitialized(true)) {
				listEntity.entries.add(entryEntity);
			}
		}

		if(seriesEntity) {
			entryEntity.series = Reference.create(seriesEntity);
			if (seriesEntity.entries.isInitialized(true)) {
				seriesEntity.entries.add(entryEntity);
			}
		}

		// Auto-creates Refs back to entryEntity
		EntryDataEntityFactory.create(entryEntity);

		// @TODO: Load entry state somehow
		entryEntity.state = EntryStatusEnum.Planning;

		// @TODO: Load entry progress somehow
		entryEntity.progress = 0;

		return entryEntity;
	}
}
