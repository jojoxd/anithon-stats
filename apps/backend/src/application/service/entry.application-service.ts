import {AnilistEntryDomainService} from "../../domain/service/anilist/entry/anilist-entry.domain-service";
import {EntryRepository} from "../../domain/repository/entry/entry.repository";
import {Service, Inject} from "@tsed/di";
import {UpdateEntryView} from "../../domain/view/anilist/entry/update-entry.view";
import {EntryView} from "../../domain/view/anilist/entry/entry.view";
import {MediaListStatus} from "../../domain/graphql/anilist/generated-types";
import {UpdateEntryProgressRequest} from "@anistats/shared";
import {EntryEntity} from "../../domain/entity/entry/entry.entity";
import {InjectRepository} from "@jojoxd/tsed-util/mikro-orm";

@Service()
export class EntryApplicationService
{
	@Inject()
	protected entryService!: AnilistEntryDomainService;
	
	@InjectRepository(EntryEntity)
	protected entryRepository!: EntryRepository;
	
	public async updateProgress(updateEntryProgressRequest: UpdateEntryProgressRequest): Promise<void>
	{
		const entryEntity = await this.entryRepository.findOneOrFail({ id: updateEntryProgressRequest.id, });
		
		const anilistEntryView = await this.entryService.getEntry(entryEntity);
		
		const updateView = this.mapUpdate(updateEntryProgressRequest, anilistEntryView);
		
		await this.entryService.updateEntry(updateView);
	}
	
	protected mapUpdate(updateEntryProgressRequest: UpdateEntryProgressRequest, anilistEntryView: EntryView): UpdateEntryView
	{
		let updateView = anilistEntryView.update();
		
		if (updateEntryProgressRequest.status === 'start') {
			if (updateView.status !== MediaListStatus.Current) {
				if (updateView.status === MediaListStatus.Completed) {
					updateView = updateView.withRewatching();
				} else {
					updateView = updateView.withWatching();
				}
			}
		}
		
		if (updateEntryProgressRequest.status === 'complete') {
			updateView = updateView.withComplete();
		}
		
		if (updateEntryProgressRequest.progress) {
			updateView = updateView.withProgress(updateEntryProgressRequest.progress);
		}
		
		return updateView;
	}
}