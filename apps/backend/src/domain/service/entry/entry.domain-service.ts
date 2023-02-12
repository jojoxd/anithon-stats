import {ListEntity} from "../../entity/list/list.entity";
import {EntryDataDto, EntryDto, EntryListDto, SeriesId} from "@anistats/shared";
import {EntryEntity} from "../../entity/entry/entry.entity";
import {Service} from "@tsed/di";
import {NotImplemented} from "@tsed/exceptions";
import {EntryView} from "../../view/entry/entry.view";
import { $log } from "@tsed/common";

@Service()
export class EntryDomainService
{
	public async getEntryList(list: ListEntity): Promise<EntryListDto>
	{
		return {
			items: await this.getEntries(list),
			data: await this.getEntryData(list),
		};
	}

	public async getEntries(list: ListEntity): Promise<Array<EntryDto>>
	{
		const entries: Array<EntryDto> = [];

		for(const entry of list.entries) {
			const entryView = new EntryView(entry);
			const sequelEntry = await this.getSequelEntry(entry, list);

			entries.push({
				id: entry.id,

				series: {
					ref: entry.series.id,
				},

				episodes: entryView.episodeCount,

				hasJoinedLastChunk: entryView.hasJoinedLastChunk,

				stats: {
					chunks: entryView.chunkCount,
					time: entryView.totalTime,
				},

				// @ts-ignore TODO: Something is wrong with this type
				sequel: sequelEntry ? { ref: sequelEntry.id, } : null,

				status: entryView.state,
			});
		}

		return entries;
	}

	protected async getSequelEntry(entry: EntryEntity, list: ListEntity): Promise<EntryEntity | null>
	{
		await entry.series.load();
		await list.entries.loadItems();
		await entry.series.getEntity().sequels.loadItems();

		// TODO: Multiple sequels are a thing, need to find best sequel
		const sequels = entry.series.getEntity().sequels.getItems();
		const sequel = list.entries.getItems().find((listEntry) => {
			return !!sequels.find(sequelEntity => sequelEntity.id === listEntry.series.id);
		});

		$log.info(`Sequel of ${entry.id} is ${sequel?.id}`);

		return sequel ?? null;
	}

	public async sync(list: ListEntity): Promise<void>
	{
		// @TODO: Sync list with anilist, and back
	}

	public async getEntryData(list: ListEntity): Promise<Array<EntryDataDto>>
	{
		return list.entries.getItems().map(entry => this.convertEntryData(entry));
	}

	protected convertEntryData(entry: EntryEntity): EntryDataDto
	{
		return {
			ref: entry.id,

			order: entry.data.order ?? null,

			mult: entry.data.mult,

			split: entry.data.split ?? null,
			splitSequelEntry: entry.data.splitSequelEntry,

			startAt: entry.data.startAt ?? null,
		};
	}
}
