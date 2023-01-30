import {SeriesDto, SeriesId} from "@anistats/shared";
import { get } from "@vueuse/core";
import { computed, ComputedRef, Ref } from "vue";
import {useListStore} from "../../store/list-store";
import {useSeriesTitle} from "./use-series-title.fn";

export interface UseSeries
{
    series: ComputedRef<SeriesDto | undefined | null>;

    seriesTitle: ComputedRef<string | undefined | null>;
}

export function useSeries(seriesId: Ref<SeriesId | undefined | null>): UseSeries
{
    const listStore = useListStore();

    const series = computed(() => {
        return listStore.getSeries(get(seriesId));
    });

    const instanceSeriesTitle = computed(() => {
        return get(series)?.title;
    });

    const {
        seriesTitle,
    } = useSeriesTitle(instanceSeriesTitle);

    return {
        series,

        seriesTitle,
    };
}
