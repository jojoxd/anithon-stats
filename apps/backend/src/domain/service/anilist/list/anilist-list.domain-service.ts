import { AnilistDomainService } from "../anilist.domain-service";
import { MediaType } from "../../../graphql/anilist/generated-types";
import { Injectable, ProviderScope } from "@tsed/di";
import { $log } from "@tsed/common";
import { InternalServerError } from "@tsed/exceptions";
import { ListEntity } from "../../../entity/list/list.entity";
import { UserEntity } from "../../../entity/user/user.entity";
import { AnilistMediaId } from "@anistats/shared";
import { ApolloError } from "@apollo/client/core";
import { MediaListCollectionView } from "../../../view/anilist/list/get-user-lists/media-list-collection.view";
import { MediaListGroupView } from "../../../view/anilist/list/get-user-lists/media-list-group.view";
import { CustomListView } from "../../../view/anilist/list/get-custom-lists-containing/custom-list.view";

import {
	GetUserLists,
	GetUserListsQuery, GetUserListsQueryVariables
} from "../../../graphql/anilist/list/get-user-lists.gql";

import {
	GetCustomListsContaining,
	GetCustomListsContainingQuery, GetCustomListsContainingQueryVariables
} from "../../../graphql/anilist/list/get-custom-lists-containing.gql";

import {
	SetEntryForCustomLists,
	SetEntryForCustomListsMutation, SetEntryForCustomListsMutationVariables
} from "../../../graphql/anilist/list/mutation/set-entry-for-custom-lists.gql";

@Injectable({ scope: ProviderScope.REQUEST })
export class AnilistListDomainService extends AnilistDomainService
{
	public async getLists(user: UserEntity): Promise<MediaListCollectionView>
	{
		console.log('Get userlists of ', user.anilistId);
		const endHistogram = this.metrics.startHistogram('GetUserLists', 'QUERY');

		const { data, errors, error, } = await this.client.query<GetUserListsQuery, GetUserListsQueryVariables>({
			query: GetUserLists,

			variables: {
				userId: user.anilistId,
				mediaType: MediaType.Anime,
			},

			errorPolicy: "ignore",
			fetchPolicy: "no-cache",
		});

		endHistogram(error?.name);
		if (errors) {
			$log.warn(`Getting lists of ${user.anilistId} failed`, { errors });
			throw new InternalServerError("Failed to fetch user lists", errors);
		}

		return new MediaListCollectionView(data!.MediaListCollection!);
	}

	public async getList(list: ListEntity): Promise<MediaListGroupView | null>
	{
		await list.user.load();
		const mediaListCollectionView = await this.getLists(list.user.getEntity());

		return mediaListCollectionView.lists.find((mediaListGroupView) => {
			return mediaListGroupView.name === list.name;
		}) ?? null;
	}

	public async addToList(list: ListEntity, mediaId: AnilistMediaId): Promise<void>
	{
		await list.user.load();

		const customLists = await this.getCustomListsContaining(mediaId, list.user.getEntity());
		const newCustomLists = [
			list.name,

			...customLists
				.filter((customList) => {
					return customList.enabled;
				})
				.map((customList) => {
					return customList.name;
				}),
		];

		if (this.safeMode) {
			$log.info(
				`[SAFEMODE] Would add series `
					+ `al:${mediaId} `
					+ `to list ${list.name} (${list.id}) `
					+ `for user ${list.user.getEntity().name}`,
				{
					customLists: customLists.filter(cl => cl.enabled).map(cl => cl.name),
					newCustomLists,
				}
			);

			return;
		}

		const endHistogram = this.metrics.startHistogram('SetEntryForCustomLists.ADD', 'MUTATION');

		const { errors, } = await this.client.mutate<SetEntryForCustomListsMutation, SetEntryForCustomListsMutationVariables>({
			mutation: SetEntryForCustomLists,
			variables: {
				listNames: newCustomLists,
				mediaId,
			},

			errorPolicy: "ignore",
			fetchPolicy: "no-cache",
		});

		endHistogram(errors?.[0]?.name);
		if (errors) {
			$log.warn('Mutation SetEntryForCustomLists.ADD failed', { errors, });

			// @TODO: Add custom error
			throw new Error("Mutation failed");
		}
	}

	public async removeFromList(list: ListEntity, mediaId: AnilistMediaId): Promise<void>
	{
		await list.user.load();

		const customLists = await this.getCustomListsContaining(mediaId, list.user.getEntity())
		const newCustomLists = customLists.filter((customList) => customList.enabled && customList.name !== list.name);

		if (this.safeMode) {
			$log.info(
				`[SAFEMODE] Would remove series `
					+ `al:${mediaId} `
					+ `from list "${list.name}" (${list.id}) `
					+ `for user ${list.user.getEntity().name}`,
				{
					customLists: customLists.filter(cl => cl.enabled).map(cl => cl.name),
					newCustomLists,
				}
			);

			return;
		}

		const endHistogram = this.metrics.startHistogram('SetEntryForCustomLists.REMOVE', 'MUTATION');

		const { errors, } = await this.client.mutate<SetEntryForCustomListsMutation, SetEntryForCustomListsMutationVariables>({
			mutation: SetEntryForCustomLists,
			variables: {
				listNames: newCustomLists.map((customList) => customList.name),
				mediaId,
			},

			errorPolicy: "ignore",
			fetchPolicy: "no-cache",
		});

		endHistogram(errors?.[0]?.name);
		if (errors) {
			$log.warn('Mutation SetEntryForCustomLists.REMOVE failed', { errors, });

			// @TODO: Add custom error
			throw new Error("Mutation failed");
		}
	}

	public async getCustomListsContaining(mediaId: AnilistMediaId, user: UserEntity): Promise<Array<CustomListView>>
	{
		const endHistogram = this.metrics.startHistogram('GetCustomListsContainingSeries', 'QUERY');

		// Apollo forces the use of try/catch here (throwServerError is called when response.status >= 300)
		// As anilist will return a 404 HTTP Status code, this means that we could never gracefully return "[]"
		try {
			const { data, error, errors, } = await this.client.query<GetCustomListsContainingQuery, GetCustomListsContainingQueryVariables>({
				query: GetCustomListsContaining,
				variables: {
					mediaId,
					userId: user.anilistId,
				},

				errorPolicy: "ignore",
				fetchPolicy: "no-cache",
			});

			endHistogram(error?.name);
			if(errors || !Array.isArray(data.MediaList?.customLists)) {
				$log.warn(`Getting lists containing ${mediaId} of ${user.anilistId} failed`, { errors });
				throw new InternalServerError(`Failed to fetch user lists for mediaId ${mediaId}`, errors);
			}

			return data.MediaList!.customLists.map((customList) => {
				return new CustomListView(customList);
			});
		} catch(e) {
			if (e instanceof ApolloError) {
				if (e.networkError && (e.networkError as any)?.statusCode === 404) {
					$log.info('Swallowing 404 from AniList');
					endHistogram(); // not a failure mode
					return [];
				}
			}

			endHistogram((e as any)?.name ?? "unknown-error");

			throw e;
		}
	}
}
