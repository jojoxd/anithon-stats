import {ListEntity} from "../entity/list/list.entity";
import {EntryDataDto, EntryDto, EntryListDto, SeriesId} from "@anistats/shared";
import {EntryEntity} from "../entity/entry/entry.entity";
import {Service} from "@tsed/di";
import {NotImplemented} from "@tsed/exceptions";
import {EntryView} from "../view/entry/entry.view";

@Service()
export class ListEntryDomainService
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

			entries.push({
				id: entry.id,

				episodes: entryView.episodeCount,
				hasJoinedLastChunk: entryView.hasJoinedLastChunk,

				// @ts-ignore TODO: NOT NULL
				series: null,

				// @ts-ignore: TODO: Allow NULL, Add Sequels
				sequel: null,

				stats: {
					chunks: entryView.chunkCount,
					time: entryView.totalTime,
				},

				status: entryView.state,
			});
		}

		return entries;
	}

	public async addEntry(seriesId: SeriesId, list: ListEntity): Promise<EntryDto>
	{
		throw new NotImplemented("Adding entries is not implemented yet");
	}

	public async removeEntry(seriesId: SeriesId, list: ListEntity): Promise<void>
	{
		throw new NotImplemented("Removing entries is not implemented yet");
	}

	public async sync(list: ListEntity): Promise<void>
	{
		// @TODO: Sync list with anilist, and back
	}

	public async getEntryData(list: ListEntity): Promise<Array<EntryDataDto>>
	{
		return list.entries.map(entry => this.convertEntryData(entry));
	}

	protected convertEntryData(entry: EntryEntity): EntryDataDto
	{
		return {
			ref: entry.id,

			order: entry.data.order,

			mult: entry.data.mult,

			split: entry.data.split,
			splitSequelEntry: entry.data.splitSequelEntry,

			startAt: entry.data.startAt,
		};
	}
}
