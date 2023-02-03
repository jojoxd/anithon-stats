import {defineStore} from "pinia";
import {ref, readonly, computed} from "vue";
import {EntryDataDto, EntryDto, EntryId, ListDto, ListId, ListMetadataDto, ListResponse, SeriesDto, SeriesId} from "@anistats/shared";
import {useAxios} from "../composition/use-axios.fn";
import { get } from "@vueuse/core";

export const useListStore = defineStore('list', () => {
    const currentList = ref<ListDto | null>(null);
    const currentEntry = ref<EntryDto | null>(null);

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

    const metadata = computed<ListMetadataDto | null>(() => {
        return currentList.value?.metadata ?? null;
    });

    const entries = computed<Array<EntryDto> | null>(() => {
        return currentList.value?.entries?.items ?? null;
    });

    const embedImageUri = computed(() => {
        return `${window.location.protocol}//${window.location.host}/api/list/${currentList.value?.id}/image.png`;
    });

    const listSettings = computed(() => {
        return currentList.value?.settings ?? null;
    });

    function getEntry(entryId: EntryId): EntryDto | undefined | null
    {
        if (!currentList.value) {
            return undefined;
        }

        return currentList.value?.entries.items.find(entry => entry.id === entryId) ?? null;
    }

    function getSeries(seriesId: SeriesId | null | undefined): SeriesDto | undefined | null
    {
        if (!currentList.value) {
            return undefined;
        }

        if (seriesId === null || typeof seriesId === 'undefined') {
            return seriesId;
        }

        return currentList.value?.series.items.find(series => series.id === seriesId) ?? null;
    }

    function getSequelEntry(entry: EntryDto): EntryDto | undefined | null
    {
        const sequelEntryId = entry.sequel?.ref;

        if (sequelEntryId) {
            return getEntry(sequelEntryId);
        }

        return null;
    }

    function getPrequelEntry(entryId: EntryId): EntryDto | undefined | null
    {
        const _entries = get(entries);

        return _entries?.find((_entry) => {
            return _entry.sequel?.ref === entryId;
        });
    }

    function getEntryData(entryId: EntryId): EntryDataDto | undefined | null
    {
        if (!currentList.value) {
            return undefined;
        }

        return currentList.value?.entries?.data?.find((entryData) => {
            return entryData.ref === entryId;
        }) ?? null;
    }

    function setCurrentEntry(entryId: EntryId) {
        // @ts-ignore Typing is incorrect, TODO: Fix this typing
        currentEntry.value = get(entries)?.find((_entry) => _entry.id === entryId) ?? null;
    }

    function reindexEntries()
    {
        const _currentList = get(currentList);

        if (!_currentList) {
            return;
        }

        // @TODO: Should we use sequels to make indexes more coherent?

        const zeroEntryData = _currentList.entries.data.filter((entryData) => entryData.order === null);
        const sortedNonZeroEntryData = _currentList.entries.data
            .filter((entryData) => entryData.order !== null)
            .sort((entryDataA, entryDataB) => {
                return entryDataB.order - entryDataA.order;
            });

        let index = 1;
        for(const entryData of sortedNonZeroEntryData) {
            entryData.order = index++;
        }

        for(const entryData of zeroEntryData) {
            entryData.order = index++;
        }
    }

    return {
        currentList,
        currentEntry,
        metadata,
        entries,

        listSettings,

        embedImageUri,

        getEntry,
        getSeries,
        getPrequelEntry,
        getSequelEntry,
        getEntryData,

        reindexEntries,

        setCurrentEntry,

        hasUnsavedChanges: readonly(hasUnsavedChanges),

        setHasUnsavedChanges(_hasUnsavedChanges: boolean) {
            hasUnsavedChanges.value = _hasUnsavedChanges;
        },

        loadList,
        saveList,
    };
});
