import {MaybeRef} from "@vueuse/core";
import {useChunks} from "../useChunks";
import {useEntries} from "../useEntries";
import {useSavedData} from "../useSavedData";
import {useListSettings} from "../useListSettings";
import {useUser} from "../useUser";
import {UserIdentifierType} from "@anistats/shared";
import {useUserList} from "../useUserList";
import {ApiStatus} from "../useApi";
import {computed} from "vue";

export function useList(listId: MaybeRef<string>)
{
    const {
        data: chunkData,
        status: chunkStatus,
        responseStatus: chunkResponseStatus,
        reload: reloadChunks,
    } = useChunks(listId);

    const {
        data: entryData,
        status: entryStatus,
        responseStatus: entryResponseStatus,
        reload: reloadEntries,
    } = useEntries(listId);

    const {
        data: savedData,
        updateSavedData,
        reload: reloadSavedData,
    } = useSavedData(listId);

    const {
        listSettings,
		status: listSettingStatus,
        updateListSettings,
        reload: reloadListSettings,
    } = useListSettings(listId);

    const {
    	user,
		status: userStatus,
		reload: reloadUser,
	} = useUser(listId, UserIdentifierType.ListUuid);

	const {
		list: listData,
		reload: reloadUserList,
	} = useUserList(user, listId);

    async function update()
    {
        for(const entry of entryData.value ?? []) {
            savedData.value!.savedData![entry.id] = entry.savedData;

            let _sequel = entry.sequel;
            while(_sequel) {
                savedData.value!.savedData![_sequel.id] = _sequel.savedData;

                _sequel = _sequel.sequel;
            }
        }

        await updateSavedData();
        await updateListSettings();
    }

    async function reload()
    {
        await reloadEntries();
        await reloadChunks();
        await reloadSavedData();
        await reloadListSettings();
        await reloadUser();
        await reloadUserList();
    }

    const status = computed(() => {
    	const statuses = [
    		chunkStatus.value,
			entryStatus.value,
			userStatus.value,
			listSettingStatus.value,
		];

    	const isInitial = statuses.includes(ApiStatus.Initial);
		if(isInitial)
			return ApiStatus.Initial;

		const isFetching = statuses.includes(ApiStatus.Fetching);
    	if(isFetching)
    		return ApiStatus.Fetching;

    	const isReloading = statuses.includes(ApiStatus.Reloading);
    	if(isReloading)
    		return ApiStatus.Reloading;

    	const isFailure = statuses.includes(ApiStatus.Failure);
    	if(isFailure)
    		return ApiStatus.Failure;

    	return ApiStatus.Ok;
	});

    return {
        chunkData,
        chunkStatus,
        chunkResponseStatus,

        entryData,
        entryStatus,
        entryResponseStatus,

		user,

        savedData,

        listSettings,

		listData,

		status,

        update,
        reload,
    };
}
