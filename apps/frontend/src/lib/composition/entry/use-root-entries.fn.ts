import { get } from "@vueuse/core";
import {storeToRefs} from "pinia";
import {Ref, customRef} from "vue";
import {useListStore} from "../../store/list.store";
import {EntryId} from "@anistats/shared";
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
					const customPrequel = _entries.find((_entry) => {
						return _entry.customSequel?.ref === entry.id;
					});

                    const prequel = customPrequel ?? _entries.find((_entry) => {
                        return _entry.sequel?.ref === entry.id;
                    });

                    if (prequel) {
                        const prequelData = listStore.getEntryData(prequel.id);

                        if (prequelData?.splitSequelEntry === true && !customPrequel) {
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
                listStore.setHasUnsavedChanges(true);

                if (!entryViews) {
                    return;
                }

                let order = 0;
                for(const entryView of entryViews) {
                    entryView.data.order = order++;
                }

                trigger();
            },
        };
    });

    return {
        rootEntries,
    };
}
