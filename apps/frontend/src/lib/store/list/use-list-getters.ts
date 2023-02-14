import {EntryDataDto, EntryDto, EntryId, ListDto, SeriesDto, SeriesId} from "@anistats/shared";
import { get } from "@vueuse/core";
import {Ref} from "vue";

export type Maybe<T> = T | null | undefined;

export interface UseListGetters
{
    getEntry(entryId: Maybe<EntryId>): Maybe<EntryDto>;
    getPrequelEntry(entryId: Maybe<EntryId>): Maybe<EntryDto>;
    getSequelEntry(entryId: Maybe<EntryId>): Maybe<EntryDto>;
    getEntryData(entryId: Maybe<EntryId>): Maybe<EntryDataDto>;

    getSeries(seriesId: Maybe<SeriesId>): Maybe<SeriesDto>;
}

export function useListGetters(currentList: Ref<ListDto | null>): UseListGetters
{
    function getEntry(entryId: Maybe<EntryId>): Maybe<EntryDto>
    {
        const _currentList = get(currentList);

        return _currentList && entryId
            ? _currentList.entries.items.find(entry => entry.id === entryId) ?? null
            : undefined;
    }

    function getSeries(seriesId: Maybe<SeriesId>): Maybe<SeriesDto>
    {
        const _currentList = get(currentList);

        return _currentList && seriesId
            ? _currentList.series.items.find(series => series.id === seriesId) ?? null
            : undefined;
    }

    function getPrequelEntry(entryId: Maybe<EntryId>): Maybe<EntryDto>
    {
        const _currentList = get(currentList);

        return _currentList && entryId
            ? _currentList.entries.items.find((_entry) => {
                return _entry.sequel?.ref === entryId;
            })
            : undefined;
    }

    function getSequelEntry(entryId: Maybe<EntryId>): Maybe<EntryDto>
    {
        const entry = getEntry(entryId);

        return entry?.sequel?.ref
            ? getEntry(entry.sequel.ref)
            : undefined;
    }

    function getEntryData(entryId: Maybe<EntryId>): Maybe<EntryDataDto>
    {
        const _currentList = get(currentList);

        return _currentList && entryId
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