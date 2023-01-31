import { get } from "@vueuse/core";
import {storeToRefs} from "pinia";
import {computed, ComputedRef} from "vue";
import {useListStore} from "../../store/list-store";
import {EntryDto} from "@anistats/shared";

export interface UseRootEntries
{
    rootEntries: ComputedRef<Array<EntryDto> | undefined | null>;
}

export function useRootEntries(): UseRootEntries
{
    const listStore = useListStore();

    const {
        entries
    } = storeToRefs(listStore);

    // @TODO: This ComputedRef should be pure (same order of entries)
    const rootEntries = computed(() => {
        const _entries = get(entries);

        if (!Array.isArray(_entries)) {
            return _entries;
        }

        const rootEntries = new Set<EntryDto>();
        for(const entry of _entries) {
            const prequel = _entries.find((_entry) => {
                return _entry.sequel?.ref === entry.id;
            });

            if (prequel) {
                const prequelData = listStore.getEntryData(prequel.id);

                if (prequelData?.splitSequelEntry) {
                    rootEntries.add(entry);
                }
            } else {
                rootEntries.add(entry);
            }
        }

        return Array.from(rootEntries).sort((entryA, entryB) => {
            return listStore.getEntryData(entryB.id)!.order - listStore.getEntryData(entryA.id)!.order;
        });
    });

    return {
        rootEntries,
    };
}
