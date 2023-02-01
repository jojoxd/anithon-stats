<script lang="ts">
    import {defineComponent, toRefs, watch} from "vue";
    import {storeToRefs} from "pinia";
    import {useListStore} from "../../lib/store/list-store";
    import {useEntry} from "../../lib/composition/entry/use-entry.fn";
    import {computedExtract} from "../../lib/util/computed-extract.fn";
    import {useSeries} from "../../lib/composition/series/use-series.fn";
    import {get} from "@vueuse/core";

    export default defineComponent({
        props: {
            open: {
                type: Boolean,
                required: true,
            },
        },

        setup(props) {
            const {
                open: drawerOpen,
            } = toRefs(props);

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
            } = useEntry(currentEntryId);

            const {
                series,
            } = useSeries(seriesId);

            watch(entryData, () => {
                listStore.setHasUnsavedChanges(true);
            }, { deep: true, });

            function onAutoSplitChange(autoSplit: boolean) {
                console.log(autoSplit);

                const _entryData = get(entryData);
                if (_entryData) {
                    console.log('Set entryData.split', autoSplit ? null : 1);
                    _entryData.split = autoSplit ? null : 1;
                }
            }

            return {
                drawerOpen,

                entry,
                entryData,
                entryTitle,
                series,
                hasSequel,

                onAutoSplitChange,
            };
        },
    });
</script>

<template>
    <v-navigation-drawer
        :model-value="drawerOpen"
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
                        v-model="entryData.mult"
                    ></v-text-field>

                    <v-text-field
                        v-if="series.episodes > 1"
                        type="number"
                        min="0"
                        :max="series.episodes - 1"
                        step="1"
                        label="Start At"
                        variant="underlined"
                        v-model="entryData.startAt"
                    ></v-text-field>
                </v-list-item>

                <v-divider />

                <v-list-item v-if="entry.episodes > 1">
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
                        :max="entry.episodes"
                        step="1"
                        v-model="entryData.split"
                        variant="underlined"
                        label="Split into"
                    >
                        <template #append>Chunks</template>
                    </v-text-field>

                    <v-checkbox
                        v-if="hasSequel"
                        v-model="entryData.splitSequelEntry"
                        label="Split Sequel"
                    ></v-checkbox>
                </v-list-item>
            </v-list>
        </template>
    </v-navigation-drawer>
</template>
