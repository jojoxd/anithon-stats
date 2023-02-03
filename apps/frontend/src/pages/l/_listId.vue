<script lang="ts">
    import {defineComponent, PropType, ref} from "vue";
    import {useVModels} from "@vueuse/core";
    import {mdiContentSave} from "@mdi/js";
    import {ListId} from "@anistats/shared";
    import {storeToRefs} from "pinia";
    import {useListStore} from "../../lib/store/list-store";
    import {useCurrentListUser} from "../../lib/composition/user/use-current-list-user.fn";
    import {useRootEntries} from "../../lib/composition/entry/use-root-entries.fn";

    export default defineComponent({
        props: {
            listId: {
                type: String as PropType<ListId>,
                required: true,
            },
        },

        setup(props, {emit}) {
            const {listId} = useVModels(props, emit);

            const listStore = useListStore();

            listStore.loadList(listId.value);

            // @TODO: Check if users are the same
            const canEdit = ref(true);

            const {
                currentList,
                currentEntry,
                embedImageUri,
                metadata,
                hasUnsavedChanges,
            } = storeToRefs(listStore);

            const {
                rootEntries,
            } = useRootEntries();

            const {
                currentListUser: user,
            } = useCurrentListUser();

            return {
                currentList,
                currentEntry,
                rootEntries,
                user,
                embedImageUri,
                metadata,
                hasUnsavedChanges,

                canEdit,

                mdiContentSave,
            };
        },
    });
</script>

<template>
	<div v-if="currentList">
        <v-badge :model-value="hasUnsavedChanges" content="Unsaved Changes" color="warning" offset-x="-10">
          <h1>{{ user?.name }} / {{ metadata.title }}</h1>
        </v-badge>

        <p>{{ metadata.description }}</p>

        <list-metadata :metadata="metadata" />

        <list-settings-card v-if="canEdit" />

        <h2>Entries</h2>

        <div class="entries">
            <draggable
                v-model="rootEntries"
                item-key="id"
            >
                <template #item="{ element: rootEntry }">
                    <entry-card :entry-id="rootEntry.id" />
                </template>
            </draggable>
        </div>

        <entry-settings-drawer :open="currentEntry !== null" />
    </div>

    <!-- TODO: Embed Image URI -->
    <!-- TODO: Allow adding items using search-series -->
    <!-- TODO: Add save button -->
    <!-- TODO: Add Sortable back for entries -->
    <!-- TODO: Add Chunk List -->
</template>
