import {Inject, Service} from "@tsed/di";
import {ListSettingsDto} from "@anistats/shared";
import {ListEntity} from "../entity/list/list.entity";
import {ListSettingsRepository} from "../repository/list/list-settings.repository";

@Service()
export class ListSettingsDomainService
{
	@Inject(ListSettingsRepository)
	protected listSettingsRepository!: ListSettingsRepository;

	async updateListSettings(listSettings: ListSettingsDto, list: ListEntity): Promise<void>
	{
		list.settings.allowChunkMerge = listSettings.allowChunkMerge;

		list.settings.maxChunkLength = listSettings.maxChunkLength;
		list.settings.maxChunkJoinLength = listSettings.maxChunkJoinLength;

		await this.listSettingsRepository.save(list.settings);
	}

	async getSettings(list: ListEntity): Promise<ListSettingsDto>
	{
		return {
			allowChunkMerge: list.settings.allowChunkMerge,

			maxChunkLength: list.settings.maxChunkLength,
			maxChunkJoinLength: list.settings.maxChunkJoinLength,
		};
	}
}
