<script lang="ts">
    import {computed, customRef, defineComponent, nextTick, watch} from "vue";
    import {storeToRefs} from "pinia";
    import {useListStore} from "../../lib/store/list.store";
    import {useEntry} from "../../lib/composition/entry/use-entry.fn";
    import {computedExtract} from "../../lib/util/computed-extract.fn";
    import {useSeries} from "../../lib/composition/series/use-series.fn";
    import {useRootEntries} from "../../lib/composition/entry/use-root-entries.fn";
    import {useBreakpoints} from "../../lib/composition/app/use-breakpoints.fn";
    import {get} from "@vueuse/core";

    export default defineComponent({
        setup() {
            const listStore = useListStore();

            const {
                currentEntry: entry,
            } = storeToRefs(listStore);

            const currentEntryId = computedExtract(entry, (entry) => entry?.id);

            const {
                entryTitle,
                entryData,
                seriesId,
                hasSequel,
                rootEntry,
            } = useEntry(currentEntryId);

            const {
                series,
            } = useSeries(seriesId);

            const {
                rootEntries,
            } = useRootEntries();

            const {
                isMobile,
            } = useBreakpoints();

            const drawerOpen = customRef((track, trigger) => {
                return {
                    get() {
                        track();
                        return !get(isMobile) || !!get(entry);
                    },

                    set(value: boolean) {
                        console.log('drawer state update to', value);
                        if(!value) {
                            listStore.setCurrentEntry(null);
                        }

                        trigger();
                    }
                };
            });

            watch(entryData, (_entryData) => {
                listStore.setHasUnsavedChanges(true);
                const _series = get(series)!;

                if (!_entryData) {
                    return;
                }

                console.log('ed', _entryData);
                if (typeof _entryData.split === 'number' && _entryData.startAt > 0) {
                    console.log('ed.split, prev = ', _entryData.split, 'new = ', Math.min(_entryData.split, _entryData.startAt ?? _series.episodes!));
                    _entryData.split = Math.max(1, Math.min(_entryData.split, _series.episodes! - _entryData.startAt));
                }
            }, { deep: true, immediate: false, });

            const directSequelSeriesId = computed(() => {
                const directSequelEntry = listStore.getSequelEntry(get(entry)!);

                return directSequelEntry?.series.ref;
            });

            const {
                seriesTitle: directSequelSeriesTitle,
            } = useSeries(directSequelSeriesId);

            function onAutoSplitChange(autoSplit: boolean): void
            {
                console.log(autoSplit);

                const _entryData = get(entryData);
                if (_entryData) {
                    console.log('Set entryData.split', autoSplit ? null : 1);
                    _entryData.split = autoSplit ? null : 1;
                }
            }

            function onSplitSequelChange(splitSequelEntry: boolean): void
            {
                const _rootEntry = get(rootEntry)!;
                const sequelEntryId = listStore.getSequelEntry(get(entry)!)!.id;
                const currentRootIndex = get(rootEntries)?.findIndex((rootEntry) => {
                    return rootEntry.id === _rootEntry.id;
                }) ?? null;

                if (!splitSequelEntry || currentRootIndex === null || currentRootIndex === -1) {
                    return;
                }

                nextTick(() => {
                    const sequelEntryIndex = currentRootIndex + 1;
                    const sequelEntryData = listStore.getEntryData(sequelEntryId)!;

                    // Get all rootEntries that will collide when pushed back
                    const reIndexingRootEntries = get(rootEntries)!
                        .slice(sequelEntryIndex)
                        .filter((entry) => entry.id !== sequelEntryId)
                        .sort((rootEntryA, rootEntryB) => {
                            return rootEntryA.order - rootEntryB.order;
                        });

                    // re-index
                    let newRootEntryIndex = sequelEntryIndex + 1;
                    for(const _rootEntry of reIndexingRootEntries) {
                        _rootEntry.data.order = newRootEntryIndex++;
                    }

                    // Finally, set sequelEntry's index correct
                    sequelEntryData.order = sequelEntryIndex;
                });
            }

            return {
                drawerOpen,

                isMobile,

                entry,
                entryData,
                entryTitle,
                series,
                hasSequel,
                directSequelSeriesTitle,

                onAutoSplitChange,
                onSplitSequelChange,
            };
        },
    });
</script>

<template>
    <v-navigation-drawer
        v-model="drawerOpen"
        :permanent="!isMobile"
        :temporary="isMobile"
        location="right"
    >
        <template v-if="entryData">
            <v-list density="compact" nav>
                <v-list-item>
                    <span class="w-100 text-subtitle-1 text-truncate d-inline-block font-italic">{{ entryTitle }}</span>
                </v-list-item>

                <v-divider />

                <v-list-item>
                    <div class="text-subtitle-2 my-2">Generic</div>
                    <v-text-field
                        type="number"
                        min="1"
                        max="2"
                        step="0.1"
                        label="Multiplier"
                        variant="underlined"
                        v-model.number="entryData.mult"
                    ></v-text-field>

                    <v-text-field
                        v-if="series.episodes > 1"
                        type="number"
                        min="0"
                        :max="series.episodes - 1"
                        step="1"
                        label="Start At"
                        variant="underlined"
                        v-model.number="entryData.startAt"
                    ></v-text-field>
                </v-list-item>

                <v-divider />

                <v-list-item>
                    <template v-if="entry.episodes > 1">
                        <div class="text-subtitle-2 my-2">Splitting</div>

                        <v-checkbox
                            label="Autosplit"
                            :model-value="entryData.split === null"
                            @update:modelValue="onAutoSplitChange"
                        ></v-checkbox>

                        <v-text-field
                            v-show="entryData.split !== null"
                            type="number"
                            min="1"
                            :max="entry.episodes - (entryData.startAt ?? 0)"
                            step="1"
                            v-model.number="entryData.split"
                            variant="underlined"
                            label="Split into"
                        >
                            <template #append>Chunks</template>
                        </v-text-field>
                    </template>

                    <template v-if="hasSequel">
                        <div :class="entry.episodes > 1 ? ['text-subtitle-2', 'mb-2', 'mt-n4'] : ['text-subtitle-2', 'my-2']">Sequel</div>
                        <span class="w-100 text-subtitle-1 text-truncate d-inline-block font-italic">{{ directSequelSeriesTitle }}</span>
                        <v-checkbox
                            v-model="entryData.splitSequelEntry"
                            @update:modelValue="onSplitSequelChange"
                            label="Split Sequel"
                        ></v-checkbox>
                    </template>
                </v-list-item>
            </v-list>
        </template>
    </v-navigation-drawer>
</template>
