import { EntryId } from "@anistats/shared";
import {Ref, ComputedRef, computed} from "vue";
import { Maybe } from "../../store/list/use-list-getters";
import {useListStore} from "../../store/list.store";
import { get } from "@vueuse/core";

export interface UseEntryMetadata
{
    episodeDuration: ComputedRef<number>;
    totalEpisodes: ComputedRef<number>;
    totalDuration: ComputedRef<number>;
}

export function useEntryMetadata(entryId: Ref<Maybe<EntryId>>): UseEntryMetadata
{
    const {
        getSeries,
        getEntry,
        getEntryData,
    } = useListStore();

    const context = computed(() => {
        const _entryId = get(entryId);
        const _entry = getEntry(_entryId);
        const _entryData = getEntryData(_entryId);

        const _series = getSeries(_entry?.series?.ref);

        return {
            entryId: _entryId,
            entry: _entry,
            entryData: _entryData,
            series: _series,
        };
    })

    const totalEpisodes = computed(() => {
        const _ctx = get(context);

        return (_ctx.series?.episodes ?? 1) - (_ctx.entryData?.startAt ?? 0);
    });

    const episodeDuration = computed(() => {
        const _ctx = get(context);

        return (_ctx.series?.duration ?? 0) * (_ctx.entryData?.mult ?? 0);
    });

    const totalDuration = computed(() => {
        return get(episodeDuration) * get(totalEpisodes);
    });

    return {
        episodeDuration,
        totalEpisodes,
        totalDuration,
    };
}
