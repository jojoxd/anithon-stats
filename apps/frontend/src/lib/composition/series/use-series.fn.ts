import {SeriesDto, SeriesId} from "@anistats/shared";
import { get } from "@vueuse/core";
import { computed, ComputedRef, Ref } from "vue";
import {useListStore} from "../../store/list.store";
import { computedExtract } from "../../util/computed-extract.fn";
import {useSeriesTitle} from "./use-series-title.fn";

export interface UseSeries
{
    series: ComputedRef<SeriesDto | undefined | null>;

    seriesTitle: ComputedRef<string | undefined | null>;

    coverImage: ComputedRef<string | undefined | null>;
}

export function useSeries(seriesId: Ref<SeriesId | undefined | null>): UseSeries
{
    const listStore = useListStore();

    const series = computed(() => {
        return listStore.getSeries(get(seriesId));
    });

    const instanceSeriesTitle = computedExtract(series, (series) => series?.title);

    const coverImage = computedExtract(series, (series) => series?.coverImage);

    const {
        seriesTitle,
    } = useSeriesTitle(instanceSeriesTitle);

    return {
        series,

        seriesTitle,

        coverImage,
    };
}
