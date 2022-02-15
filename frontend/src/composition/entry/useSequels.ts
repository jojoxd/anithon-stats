import {IEntry} from "@anistats/shared";
import {ref, Ref, watch } from "vue";

export function useSequels(entry: Ref<IEntry>): Ref<Array<IEntry>>
{
    const sequels: Ref<Array<IEntry>> = ref([]);

    watch(entry, () => {
        sequels.value = [];

        let _entry = entry.value as IEntry;
        while(_entry && _entry.sequel) {
            sequels.value.push(_entry.sequel);

            console.log('[useSequels] %s => SEQ %s', _entry.series.title.romaji, _entry.sequel.series.title.romaji);

            _entry = _entry.sequel;
        }
    }, { immediate: true });

    return sequels;
}
