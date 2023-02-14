import {useListGetters} from "../../../store/list/use-list-getters";
import {useListStore} from "../../../store/list.store";
import {EntryDataDto, EntryDto, EntryId, SeriesDto, SeriesId} from "@anistats/shared";
import { Ref, ComputedRef, computed } from "vue";
import { Maybe } from "../../../store/list/use-list-getters";
import { get } from "@vueuse/core";
import { storeToRefs } from "pinia";

export interface UseComputedListStore
{
    fetchEntry(ref: Ref<EntryId>): ComputedRef<Maybe<EntryDto>>;

    fetchEntryData(ref: Ref<EntryId>): ComputedRef<Maybe<EntryDataDto>>;

    fetchSeries(ref: Ref<Maybe<SeriesId>>): ComputedRef<Maybe<SeriesDto>>;
}

export function useDynamicListStore(): UseComputedListStore
{
    const {
        currentList,
    } = storeToRefs(useListStore());

    const {
        getEntry,
        getSeries,
        getEntryData,
    } = useListGetters(currentList);

    function fetchEntry(entryId: Ref<Maybe<EntryId>>): ComputedRef<Maybe<EntryDto>>
    {
        return computed(() => {
            const _entryId = get(entryId);

            return getEntry(_entryId);
        });
    }

    function fetchSeries(seriesId: Ref<Maybe<SeriesId>>): ComputedRef<Maybe<SeriesDto>>
    {
        return computed(() => {
            const _seriesId = get(seriesId);

            return getSeries(_seriesId);
        })
    }

    function fetchEntryData(entryId: Ref<Maybe<EntryId>>): ComputedRef<Maybe<EntryDataDto>>
    {
        return computed(() => {
            const _entryId = get(entryId);

            return getEntryData(_entryId);
        })
    }

    return {
        fetchEntry,
        fetchEntryData,

        fetchSeries,
    };
}