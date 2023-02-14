import { get } from "@vueuse/core";
import {computed, ComputedRef } from "vue";
import { useListStore } from "../../store/list.store";
import {EntryDataDto, EntryDto, EntryId, SeriesId} from "@anistats/shared";
import {useSeries} from "../series/use-series.fn";
import {computedExtract} from "../../util/computed-extract.fn";
import {useDynamicListStore} from "../store/list/use-dynamic-list-store.fn";

interface UseEntry
{
    entry: ComputedRef<EntryDto | undefined | null>;

    rootEntry: ComputedRef<EntryDto | undefined | null>;

    entryData: ComputedRef<EntryDataDto | undefined | null>;

    entryTitle: ComputedRef<string | undefined | null>;

    seriesId: ComputedRef<SeriesId | undefined | null>;

    sequels: ComputedRef<Array<EntryDto> | undefined | null>;

    hasSequel: ComputedRef<boolean>;
}

export function useEntry(entryId: ComputedRef<EntryId>): UseEntry
{
    const listStore = useListStore();

    const {
        fetchEntry,
        fetchEntryData,
    } = useDynamicListStore();

    const entry = fetchEntry(entryId);
    const entryData = fetchEntryData(entryId);

    const seriesId = computedExtract(entry, (entry) => entry?.series.ref);

    const sequels = computed(() => {
        const _entry = get(entry);
        const _entryData = get(entryData);

        if (!_entry) {
            return _entry;
        }

        if (_entryData?.splitSequelEntry) {
            return [];
        }


        let sequelEntry = listStore.getSequelEntry(_entry);
        const sequels = [];

        while(sequelEntry) {
            sequels.push(sequelEntry);

            const _sequelEntryData = listStore.getEntryData(sequelEntry.id);
            if (_sequelEntryData?.splitSequelEntry) {
                break;
            }

            sequelEntry = listStore.getSequelEntry(sequelEntry);
        }

        return sequels;
    });

    const hasSequel = computed(() => {
        const _entry = get(entry);

        if (!_entry) {
            return false;
        }

        return !!listStore.getSequelEntry(_entry);
    });

    const rootEntry = computed(() => {
        let _entry = get(entry);

        while(_entry) {
            const prequelEntry = listStore.getPrequelEntry(_entry.id);

            if (!prequelEntry) {
                return _entry;
            }

            const prequelEntryData = listStore.getEntryData(prequelEntry.id)!;
            if (prequelEntryData.splitSequelEntry) {
                return _entry;
            }

            _entry = prequelEntry;
        }

        return _entry;
    });

    const {
        seriesTitle,
    } = useSeries(seriesId);

    return {
        entry,
        rootEntry,

        entryData,

        seriesId,

        entryTitle: seriesTitle,

        sequels,
        hasSequel,
    };
}
