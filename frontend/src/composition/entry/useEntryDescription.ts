import {IEntry} from "@anistats/shared";
import {ref, Ref, watch} from "vue";

export function useEntryDescription(entry: Ref<IEntry>): Ref<string>
{
    const description = ref("Unknown")

    watch(entry, () => {
        description.value = entry.value?.series?.description ?? "No Description Available";
    }, { immediate: true });

    return description;
}
