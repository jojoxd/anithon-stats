import { get } from "@vueuse/core";
import {computed, ComputedRef } from "vue";
import { useListStore } from "../../store/list-store";
import {EntryDataDto, EntryDto, EntryId} from "@anistats/shared";
import {useSeries} from "../series/use-series.fn";

interface UseEntry
{
    entry: ComputedRef<EntryDto | undefined | null>;

    entryData: ComputedRef<EntryDataDto | undefined | null>;

    entryTitle: ComputedRef<string | undefined | null>;

    sequels: ComputedRef<Array<EntryDto> | undefined | null>;
}

export function useEntry(entryId: ComputedRef<EntryId>): UseEntry
{
    const listStore = useListStore();

    const entry = computed(() => {
        return listStore.getEntry(get(entryId));
    });

    const entryData = computed(() => {
        return listStore.getEntryData(get(entryId));
    });

    const seriesId = computed(() => {
        return get(entry)?.series.ref;
    });

    const sequels = computed(() => {
        const _entry = get(entry);

        if (!_entry) {
            return _entry;
        }

        let sequelEntry = listStore.getSequelEntry(_entry);
        const sequels = [];

        while(sequelEntry) {
            sequels.push(sequelEntry);
            sequelEntry = listStore.getSequelEntry(sequelEntry);
        }

        return sequels;
    });

    const {
        seriesTitle,
    } = useSeries(seriesId);

    return {
        entry,
        entryData,

        entryTitle: seriesTitle,

        sequels,
    };
}
