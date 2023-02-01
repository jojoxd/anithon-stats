import { get } from "@vueuse/core";
import {storeToRefs} from "pinia";
import {computed, ComputedRef, reactive} from "vue";
import {useListStore} from "../../store/list-store";
import {EntryDto, EntryId} from "@anistats/shared";

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

    // @pure
    const rootEntries = computed(() => {
        const _entries = get(entries);

        if (!Array.isArray(_entries)) {
            return _entries;
        }

        const rootEntryIds = new Set<EntryId>();
        for(const entry of _entries) {
            const prequel = _entries.find((_entry) => {
                return _entry.sequel?.ref === entry.id;
            });

            if (prequel) {
                const prequelData = listStore.getEntryData(prequel.id);

                if (prequelData?.splitSequelEntry === true) {
                    rootEntryIds.add(entry.id);
                }
            } else {
                rootEntryIds.add(entry.id);
            }
        }

        return Array.from(rootEntryIds).sort((entryIdA, entryIdB) => {
            return listStore.getEntryData(entryIdA)!.order - listStore.getEntryData(entryIdB)!.order;
        }).map(entryId => reactive(listStore.getEntry(entryId)!));
    });

    return {
        rootEntries,
    };
}
