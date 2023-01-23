import {Service} from "@tsed/di";
import {ListEntity} from "../entity/list/list.entity";
import {EntryDataDto} from "@anistats/shared";
import {EntryDataRepository} from "../repository/entry/entry-data.repository";
import {InjectRepository} from "@jojoxd/tsed-util/mikro-orm";
import {EntryDataEntity} from "../entity/entry/entry-data.entity";

@Service()
export class ListEntryDataDomainService
{
	@InjectRepository(EntryDataEntity)
	protected entryDataRepository!: EntryDataRepository;

	public async updateEntryData(data: Array<EntryDataDto>, list: ListEntity): Promise<void>
	{
		for(const entryData of data) {
			const entry = list.entries.getItems().find((entry) => entry.id === entryData.ref);

			if (!entry) {
				// @TODO: Is this correct, or do we want to throw away the full update?
				//        The entry might be removed here
				continue;
			}

			entry.data.mult = entryData.mult;
			entry.data.order = entryData.order;
			entry.data.split = entryData.split ?? undefined;
			entry.data.splitSequelEntry = entryData.splitSequelEntry;
			entry.data.startAt = entryData.startAt ?? undefined;

			await this.entryDataRepository.persist(entry.data);
		}
	}
}
