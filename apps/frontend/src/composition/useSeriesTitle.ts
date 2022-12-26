import {SeriesTitleDto} from "@anistats/shared";
import {get, MaybeRef} from "@vueuse/core";
import {Language, useAppStore} from "./store/app-store";
import {storeToRefs} from "pinia";
import {computed} from "vue";

export function useSeriesTitle(title: MaybeRef<SeriesTitleDto>)
{
    const { language } = storeToRefs(useAppStore());

    return {
        seriesTitle: computed(() => {
            const _language = get(language);
            const _title = get(title);

            if(_language === Language.English && _title.english) {
                return _title.english;
            }

            if(_language === Language.Native && _title.native) {
                return _title.native;
            }

            if(_language === Language.Romaji && _title.romaji) {
                return _title.romaji;
            }

            return _title.english ?? _title.romaji ?? _title.native ?? "No Title Available";
        }),
    };
}
