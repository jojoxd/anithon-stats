import {Inject, Service} from "@tsed/di";
import {ListEntity} from "../../entity/list/list.entity";
import {ListMetadataDto, ListMetadataStatsDto} from "@anistats/shared";
import {SeriesDomainService} from "../series/series.domain-service";

@Service()
export class ListMetadataDomainService
{
	@Inject()
	protected seriesService!: SeriesDomainService;

	public async getMetadata(list: ListEntity): Promise<ListMetadataDto>
	{
		return {
			title: list.name,
			ref: {
				id: list.id,
			},
			description: 'NOTE: Lists don\'t have a description right now',
			stats: this.createMetadataStats(list),
		};
	}

	protected createMetadataStats(list: ListEntity): ListMetadataStatsDto
	{
		return {
			time: list.entries.getItems().reduce((totalTime, entry) => {
				return totalTime + (this.seriesService.getTotalDuration(entry.series.getEntity()) ?? 0);
			}, 0) ?? 0,
		};
	}
}
