import {IEntry} from "@anistats/shared";
import {ref, Ref, watch} from "vue";

/**
 * Creates a reference to an Entry's title
 */
export function useEntryTitle(entry: Ref<IEntry>): Ref<string>
{
    const title = ref("Unknown")

    // @TODO: Add Switch somehow

    watch(entry, () => {
        title.value = entry.value?.series?.title?.romaji ?? "Unknown";
    }, { immediate: true });

    return title;
}
