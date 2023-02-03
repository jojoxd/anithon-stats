import { get } from "@vueuse/core";
import {storeToRefs} from "pinia";
import {Ref, customRef} from "vue";
import {useListStore} from "../../store/list-store";
import {EntryDto, EntryId} from "@anistats/shared";
import { EntryView } from "../../view/entry.view";

export interface UseRootEntries
{
    rootEntries: Ref<Array<EntryView> | undefined | null>;
}

export function useRootEntries(): UseRootEntries
{
    const listStore = useListStore();

    const {
        entries,
    } = storeToRefs(listStore);

    const rootEntries = customRef((track, trigger) => {
        return {
            get() {
                console.log('COMPUTE ROOT ENTRIES');
                track();

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

                return Array.from(rootEntryIds)
                    .map(entryId => new EntryView(listStore.getEntry(entryId)!))
                    .sort((entryViewA, entryViewB) => entryViewA.order! - entryViewB.order!);
            },
            set(entryViews) {
                console.log('SET LIST', entryViews);

                if (!entryViews) {
                    return;
                }

                let order = 0;
                for(const entryView of entryViews) {
                    entryView.data.order = order++;
                }

                trigger();
            }
        }
    });

    function reindex(_rootEntries: Array<EntryDto>): void
    {
        if (!_rootEntries) {
            return;
        }

        const entryDatas = _rootEntries.map(rootEntry => listStore.getEntryData(rootEntry.id)!);

        const zeroEntryData = entryDatas.filter((entryData) => entryData.order === null);
        const sortedNonZeroEntryData = entryDatas
            .filter((entryData) => entryData.order !== null)
            .sort((entryDataA, entryDataB) => {
                return entryDataB.order - entryDataA.order;
            });

        // Clear non-root entries to null
        const _entries = get(entries);
        _entries?.filter((_entry) => {
            return !entryDatas.find((rootEntryData) => rootEntryData.ref === _entry.id);
        }).forEach((_entry) => {
            console.log('UNSET ORDER OF ', _entry.id);
            listStore.getEntryData(_entry.id)!.order = null;
        });

        // re-index
        let index = 1;
        for(const entryData of sortedNonZeroEntryData) {
            console.log('SET ORDER OF ', entryData.ref, index);
            entryData.order = index++;
        }

        for(const entryData of zeroEntryData) {
            console.log('SET ORDER OF ', entryData.ref, index);
            entryData.order = index++;
        }
    }

    return {
        rootEntries,
    };
}
