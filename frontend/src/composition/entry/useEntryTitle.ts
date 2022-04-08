import {IEntry} from "@anistats/shared";
import {Ref, computed} from "vue";
import {useLanguageSwitcher, Language} from "../useLanguageSwitcher";

/**
 * Creates a reference to an Entry's title
 */
export function useEntryTitle(entry: Ref<IEntry>): Ref<string>
{
    const { language } = useLanguageSwitcher();

    return computed(() => {
        if(language.value == Language.English && entry.value?.series?.title?.english)
            return entry.value.series.title.english;

        if(language.value == Language.Native && entry.value?.series?.title?.native)
            return entry.value.series.title.native;

        if(language.value == Language.Romaji && entry.value?.series?.title?.romaji)
            return entry.value.series.title.romaji;

        return entry.value?.series?.title?.english ??
            entry.value?.series?.title?.romaji ??
            entry.value?.series?.title?.native ??
            "No Title Available";
    });
}
