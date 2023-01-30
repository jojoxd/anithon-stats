<script lang="ts">
    import {defineComponent, watch} from "vue";
    import {storeToRefs} from "pinia";
    import {useListStore} from "../../lib/store/list-store";
    import {useEntry} from "../../lib/composition/entry/use-entry.fn";

    export default defineComponent({
        setup() {
            const listStore = useListStore();

            const {
                currentEntry,
            } = storeToRefs(listStore);

            const {
                entryTitle,
                entryData,
            } = useEntry(currentEntry);

            // @TODO: WOOP WOOP?
            watch(entryData, () => {
                listStore.setHasUnsavedChanges(true);
            });

            return {
                entryTitle,

                currentEntry,
                entryData,
            };
        },
    });
</script>

<template>
    <v-navigation-drawer
        permanent
        location="right"
    >
        <v-list density="compact" nav>
            <v-list-item>{{ entryTitle }}</v-list-item>

            {{ entryData }}
        </v-list>
    </v-navigation-drawer>
</template>
