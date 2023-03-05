import {defineStore} from "pinia";
import {computed, readonly, ref} from "vue";
import {
    EntryDto,
    EntryId,
    ListDto,
} from "@anistats/shared";
import {get} from "@vueuse/core";
import { useListApi } from "./list/use-list-api";
import { useListExtractors } from "./list/use-list-extractors";
import { useListGetters } from "./list/use-list-getters";
import { useListCrud } from "./list/use-list-crud";

export const useListStore = defineStore('list', () => {
    const currentList = ref<ListDto | null>(null);
    const currentEntry = ref<EntryDto | null>(null);

    const {
        loadList,
        saveList,

        hasUnsavedChanges,
    } = useListApi(currentList);

    const {
        metadata,
        entries,

        listSettings,

        chunks,

		user,
    } = useListExtractors(currentList);

    const embedImageUri = computed(() => {
        return `${window.location.protocol}//${window.location.host}/api/list/${currentList.value?.id}/image.png`;
    });

    const {
        getEntry,
        getPrequelEntry,
        getSequelEntry: todoRefactorToUseID_getSequelEntry,
        getEntryData,

        getSeries,
    } = useListGetters(currentList);

    function getSequelEntry(entry: EntryDto): EntryDto | undefined | null
    {
        return todoRefactorToUseID_getSequelEntry(entry.id);
    }

    function setCurrentEntry(entryId: EntryId | null) {
        // @ts-ignore Typing is incorrect, TODO: Fix this typing
        currentEntry.value = get(entries)?.find((_entry) => _entry.id === entryId) ?? null;
    }

    const {
        addEntryBySeries,
        removeEntry,
    } = useListCrud(currentList);

    return {
        currentList,
        currentEntry,
        metadata,
        entries,
        chunks,
		user,

        listSettings,

        embedImageUri,

        getEntry,
        addEntryBySeries,
        removeEntry,

        getSeries,
        getPrequelEntry,
        getSequelEntry,
        getEntryData,

        setCurrentEntry,

        hasUnsavedChanges: readonly(hasUnsavedChanges),

        setHasUnsavedChanges(_hasUnsavedChanges: boolean) {
            hasUnsavedChanges.value = _hasUnsavedChanges;
        },

        loadList,
        saveList,
    };
});
