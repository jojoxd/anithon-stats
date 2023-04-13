import {AnilistDomainService} from "../anilist.domain-service";
import {EntryEntity} from "../../../entity";
import {EntryView} from "../../../view/anilist/entry/entry.view";
import {UpdateEntryView} from "../../../view/anilist/entry/update-entry.view";
import { $log, Injectable, ProviderScope } from "@tsed/common";

import {
	UpdateEntry,
	UpdateEntryMutation, UpdateEntryMutationVariables
} from "../../../graphql/anilist/entry/mutation/update-entry.gql";

import {
	GetEntry,
	GetEntryQuery, GetEntryQueryVariables
} from "../../../graphql/anilist/entry/get-entry.gql";
import { InternalServerError } from "@tsed/exceptions";
import {AnilistEntryId} from "@anistats/shared";

@Injectable({ scope: ProviderScope.REQUEST, })
export class AnilistEntryDomainService extends AnilistDomainService
{
	public async getEntry(entryEntity: EntryEntity): Promise<EntryView>
	{
		console.log(`Get entry ${entryEntity.anilistId}`);
		const endHistogram = this.metrics.startHistogram('GetEntry', 'QUERY');
		
		const { data, errors, error, } = await this.client.query<GetEntryQuery, GetEntryQueryVariables>({
			query: GetEntry,
			
			variables: {
				entryId: entryEntity.anilistId,
			},
			
			errorPolicy: "ignore",
			fetchPolicy: "no-cache",
		});
		
		endHistogram(error?.name);
		if (errors) {
			$log.warn(`Getting entry ${entryEntity.anilistId} failed`, { errors, });
			throw new InternalServerError("Failed to fetch entry", errors);
		}
		
		return new EntryView(
			data!.MediaList!.id! as unknown as AnilistEntryId,
			data!.MediaList!.status!,
			data!.MediaList!.progress!,
			data!.MediaList!.repeat!,
		);
	}

	public async updateEntry(updateEntryView: UpdateEntryView): Promise<void>
	{
		if (this.safeMode) {
			$log.info(`[SAFEMODE] Would update entries`, { updateEntryView, });

			return;
		}

		const endHistogram = this.metrics.startHistogram('UpdateEntry', 'MUTATION');

		const { errors, } = await this.client.mutate<UpdateEntryMutation, UpdateEntryMutationVariables>({
			mutation: UpdateEntry,
			variables: {
				entryId: updateEntryView.id,
				progress: updateEntryView.progress,
				repeats: updateEntryView.repeats,
				status: updateEntryView.status,
			},

			errorPolicy: "ignore",
			fetchPolicy: "no-cache",
		});

		endHistogram(errors?.[0]?.name);
		if (errors) {
			$log.warn('Mutation UpdateEntry failed', { errors, });

			// @TODO: Add custom error
			throw new Error("Mutation failed");
		}
	}
}