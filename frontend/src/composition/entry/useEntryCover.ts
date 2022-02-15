import {IEntry} from "@anistats/shared";
import {ref, Ref, watch} from "vue";

const FALLBACK_COVER = "";

export function useEntryCover(entry: Ref<IEntry>): Ref<string>
{
    const cover = ref(FALLBACK_COVER); // @TODO: Safe fallback

    watch(entry, () => {
        cover.value = entry.value?.series?.coverImage ?? FALLBACK_COVER;
    }, { immediate: true });

    return cover;
}
