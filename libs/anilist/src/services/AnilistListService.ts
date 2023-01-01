import {Inject, Service} from "@tsed/di";
import {AnilistClientService} from "./AnilistClientService";
import addEntryToListQuery from "../gql/mutation/addEntryToList.gql";
import {
    addEntryToList, addEntryToListVariables, AnilistService, CustomListJson,
    getListsContainingMediaId, getListsContainingMediaIdVariables, removeEntryFromList, removeEntryFromListVariables
} from "..";

import getListsContainingMediaIdQuery from "../gql/getListsContainingMediaId.gql";

@Service()
export class AnilistListService
{
    @Inject()
    protected client!: AnilistClientService;

    @Inject()
    protected baseService!: AnilistService;

    public async addEntry(listName: string, mediaId: number): Promise<number | null | undefined>
    {
        const currentUser = await this.baseService.getCurrentUser();

        if (!currentUser) {
            throw new Error(`Can't add list to user as we are not authenticated`);
        }

        const originalListNames = await this.getListsContainingMediaId(currentUser.id, mediaId);

        // Add Entry to lists
        return this.client.mutate<addEntryToList, addEntryToListVariables, number>({
            mutation: addEntryToListQuery,
            variables: {
                listNames: [...originalListNames, listName],
                mediaId,
            },

            convert: (val) => val?.SaveMediaListEntry?.id ?? null,
        });
    }

    public async removeEntry(listName: string, mediaId: number): Promise<void>
    {
        const currentUser = await this.baseService.getCurrentUser();

        if (!currentUser) {
            console.log('NO CURRENT USER');
            throw new Error(`Can't remove list entry from user as we are not authenticated`);
        }

        const originalListNames = await this.getListsContainingMediaId(currentUser.id, mediaId);

        // Add Entry to lists
        await this.client.mutate<addEntryToList, addEntryToListVariables, number>({
            mutation: addEntryToListQuery,
            variables: {
                listNames: originalListNames.filter((originalListName) => originalListName !== listName),
                mediaId,
            },
        });
    }

    public async getListsContainingMediaId(userId: number, mediaId: number): Promise<Array<string>>
    {
        const lists = await this.client.query<getListsContainingMediaId, getListsContainingMediaIdVariables, Array<string>>({
            query: getListsContainingMediaIdQuery,
            variables: {
                userId,
                mediaId,
            },

            key: 'getListsContainingMediaId',
            convert: (val) =>
                val.MediaList!.customLists
                    ?.filter((list: CustomListJson) => list.enabled)
                    ?.map((list: CustomListJson) => list.name),
        });

        if (!lists) {
            throw new Error(`Failed to fetch lists containing ${mediaId} on user ${userId}`);
        }

        return lists;
    }
}
