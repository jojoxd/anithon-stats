import { get, useTitle as vueUseTitle } from "@vueuse/core";
import { computed, ref } from "vue";

export function useTitle()
{
    const title = ref<string | null>(null);

    const _title = computed<string>(() => {
        const _title = get(title);

        if(!_title)
            return 'AniStats';

        return `${_title} | AniStats`;
    });

    vueUseTitle(_title);

    return title;
}