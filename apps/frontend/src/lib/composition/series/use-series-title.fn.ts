import { SeriesTitleDto } from "@anistats/shared";
import {get, MaybeRef } from "@vueuse/core";
import {computed, ComputedRef} from "vue";
import { useAppStore } from "../../store/app-store";
import { storeToRefs } from "pinia";
import { Language } from "../../store/types/language.enum";

export interface UseSeriesTitle
{
    seriesTitle: ComputedRef<string | undefined | null>;
}

export function useSeriesTitle(seriesTitle: MaybeRef<SeriesTitleDto | undefined | null>): UseSeriesTitle
{
    const {
        language,
    } = storeToRefs(useAppStore());

    const computedTitle = computed(() => {
        const _seriesTitle = get(seriesTitle);
        const _language = get(language);

        if (!_seriesTitle) {
            return _seriesTitle;
        }

        if (_language === Language.English && _seriesTitle.english) {
            return _seriesTitle.english;
        }

        if (_language === Language.Romaji && _seriesTitle.romaji) {
            return _seriesTitle.romaji;
        }

        if (_language === Language.Native && _seriesTitle.native) {
            return _seriesTitle.native;
        }

        return _seriesTitle.romaji ?? _seriesTitle.english ?? _seriesTitle.native ?? null;
    });

    return {
        seriesTitle: computedTitle,
    };
}
