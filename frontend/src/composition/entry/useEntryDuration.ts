import {IEntry} from "@anistats/shared";
import {ref, Ref, watch} from "vue";

/**
 * Creates a reference to Duration Data of an Entry
 */
export function useEntryDuration(entry: Ref<IEntry>): IUseEntryDurationReturn
{
    const episodes = ref(0);

    const episodeDuration = ref(0);
    const totalDuration = ref(0);

    watch(entry, () => {
        episodes.value = entry.value.series.episodes!;

        if(entry.value.savedData.startAt) {
            episodes.value = entry.value.series.episodes! - entry.value.savedData.startAt;
        }

        episodeDuration.value = entry.value.series.duration! * entry.value.savedData.mult;
        totalDuration.value = episodes.value * episodeDuration.value;
    }, { immediate: true, deep: true });

    return {
        episodes,

        episodeDuration,
        totalDuration,
    };
}

interface IUseEntryDurationReturn
{
    episodes: Ref<number>;

    episodeDuration: Ref<number>;
    totalDuration: Ref<number>;
}
