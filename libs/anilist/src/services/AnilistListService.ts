import {Inject, Service} from "@tsed/di";
import {AnilistClientService} from "./AnilistClientService";
import addEntryToListQuery from "../gql/mutation/addEntryToList.gql";
import {addEntryToList, addEntryToListVariables} from "..";

@Service()
export class AnilistListService
{
    @Inject()
    protected client!: AnilistClientService;

    async addEntry(listName: string, mediaId: number): Promise<number | null | undefined>
    {
        return this.client.mutate<addEntryToList, addEntryToListVariables, number>({
            mutation: addEntryToListQuery,
            variables: {
                listName,
                mediaId,
            },

            convert: (val) => val?.SaveMediaListEntry?.id ?? null,
        });
    }

    async removeEntry(listName: string, id: number): Promise<void>
    {
        throw new Error("Removing entries not implemented");
    }
}
