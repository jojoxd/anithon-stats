import {defineStore} from "pinia";
import { ref, readonly, computed } from "vue";
import {EntryDto, EntryId, ListDto, ListId, ListResponse, SeriesDto, SeriesId} from "@anistats/shared";
import {useAxios} from "../useAxios";

export const useListStore = defineStore('list', () => {
    const currentList = ref<ListDto | null>();

    const hasUnsavedChanges = ref<boolean>(false);

    const axios = useAxios();

    async function loadList(id: ListId) {
        console.log('Load List', id);

        const response = await axios.get<ListResponse>(`list/${id}`);

        currentList.value = response.data?.list ?? null;
        hasUnsavedChanges.value = false;
    }

    async function saveList() {
        console.log('Save List');
    }

    const listUser = computed(() => {
        return currentList.value?.user ?? null;
    });

    const metadata = computed(() => {
        return currentList.value?.metadata;
    });

    const embedImageUri = computed(() => {
        return `${window.location.protocol}//${window.location.host}/api/list/${currentList.value?.id}/image.png`;
    });

    const listSettings = computed(() => {
        return currentList.value?.settings ?? null;
    })

    function getEntry(entryId: EntryId): EntryDto | undefined | null
    {
        if (!currentList.value) {
            return undefined;
        }

        return currentList.value?.entries.items.find(entry => entry.id === entryId) ?? null;
    }

    function getSeries(seriesId: SeriesId): SeriesDto | undefined | null
    {
        if (!currentList.value) {
            return undefined;
        }

        return currentList.value?.series.items.find(series => series.id === seriesId) ?? null;
    }

    return {
        currentList,
        listUser,
        metadata,

        listSettings,

        embedImageUri,

        getEntry,
        getSeries,

        hasUnsavedChanges: readonly(hasUnsavedChanges),

        setHasUnsavedChanges(_hasUnsavedChanges: boolean) {
            hasUnsavedChanges.value = _hasUnsavedChanges;
        },

        loadList,
        saveList,
    };
});
