import {EntryDataDto, EntryDto, EntryId, ListDto, SeriesDto, SeriesId} from "@anistats/shared";
import { get } from "@vueuse/core";
import {Ref} from "vue";

type Maybe<T> = T | null | undefined;

export interface UseListGetters
{
    getEntry(entryId: EntryId): Maybe<EntryDto>;
    getPrequelEntry(entryId: EntryId): Maybe<EntryDto>;
    getSequelEntry(entryId: EntryId): Maybe<EntryDto>;
    getEntryData(entryId: EntryId): Maybe<EntryDataDto>;

    getSeries(seriesId: Maybe<SeriesId>): Maybe<SeriesDto>;
}

export function useListGetters(currentList: Ref<ListDto | null>): UseListGetters
{
    function getEntry(entryId: EntryId): Maybe<EntryDto>
    {
        const _currentList = get(currentList);

        return _currentList
            ? _currentList.entries.items.find(entry => entry.id === entryId) ?? null
            : undefined;
    }

    function getSeries(seriesId: Maybe<SeriesId>): Maybe<SeriesDto>
    {
        const _currentList = get(currentList);

        if (seriesId === null || typeof seriesId === 'undefined') {
            return seriesId;
        }

        return _currentList
            ? _currentList.series.items.find(series => series.id === seriesId) ?? null
            : undefined;
    }

    function getPrequelEntry(entryId: EntryId): Maybe<EntryDto>
    {
        const _currentList = get(currentList);

        return _currentList
            ? _currentList.entries.items.find((_entry) => {
                return _entry.sequel?.ref === entryId;
            })
            : undefined;
    }

    function getSequelEntry(entryId: EntryId): Maybe<EntryDto>
    {
        const entry = getEntry(entryId);

        return entry?.sequel?.ref
            ? getEntry(entry.sequel.ref)
            : undefined;
    }

    function getEntryData(entryId: EntryId): Maybe<EntryDataDto>
    {
        const _currentList = get(currentList);

        return _currentList
            ? _currentList.entries.data.find((entryData) => {
                return entryData.ref === entryId;
            })
            : undefined;
    }

    return {
        getEntry,
        getPrequelEntry,
        getSequelEntry,
        getEntryData,

        getSeries,
    };
}