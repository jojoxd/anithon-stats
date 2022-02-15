import {IEntry} from "@anistats/shared";
import {ref, Ref, watch} from "vue";

const FALLBACK_COVER = "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/default.jpg";

/**
 * Creates a reference to an image URL for a specific Ref<Entry>
 */
export function useEntryCover(entry: Ref<IEntry>): Ref<string>
{
    const cover = ref(FALLBACK_COVER);

    watch(entry, () => {
        cover.value = entry.value?.series?.coverImage ?? FALLBACK_COVER;
    }, { immediate: true });

    return cover;
}
