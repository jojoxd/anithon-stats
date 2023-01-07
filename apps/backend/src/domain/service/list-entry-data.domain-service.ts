import {Inject, Service} from "@tsed/di";
import {ListEntity} from "../entity/list/list.entity";
import {EntryDataDto} from "@anistats/shared";
import {EntryDataRepository} from "../repository/entry/entry-data.repository";

@Service()
export class ListEntryDataDomainService
{
	@Inject(EntryDataRepository)
	protected entryDataRepository!: EntryDataRepository;

	public async updateEntryData(data: Array<EntryDataDto>, list: ListEntity): Promise<void>
	{
		for(const entryData of data) {
			const entry = list.entries.find((entry) => entry.id === entryData.ref);

			if (!entry) {
				// @TODO: Is this correct, or do we want to throw away the full update?
				//        The entry might be removed here
				continue;
			}

			entry.data.mult = entryData.mult;
			entry.data.order = entryData.order;
			entry.data.split = entryData.split;
			entry.data.splitSequelEntry = entryData.splitSequelEntry;
			entry.data.startAt = entryData.startAt;

			await this.entryDataRepository.save(entry.data);
		}
	}
}
