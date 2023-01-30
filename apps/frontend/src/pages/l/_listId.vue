<script lang="ts">
    import {defineComponent, PropType, ref} from "vue";
    import {useVModels} from "@vueuse/core";
    import {mdiContentSave} from "@mdi/js";
    import {ListId} from "@anistats/shared";
    import {storeToRefs} from "pinia";
    import {useListStore} from "../../lib/store/list-store";

    export default defineComponent({
        props: {
            listId: {
                type: String as unknown as PropType<ListId>,
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
                rootEntries,
                listUser,
                embedImageUri,
                metadata,
                hasUnsavedChanges,
            } = storeToRefs(listStore);

            return {
                currentList,
                currentEntry,
                rootEntries,
                listUser,
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
          <h1>{{ listUser.name }} / {{ metadata.title }}</h1>
        </v-badge>

        <p>{{ metadata.description }}</p>

        <list-metadata :metadata="metadata" />

        <list-settings-card v-if="canEdit" />

        <h2>Entries</h2>

        <div class="entries">
            <template v-for="rootEntry of rootEntries">
                <entry-card :entry="rootEntry" />
            </template>
        </div>

        <entry-settings-drawer :open="currentEntry !== null" />
    </div>

    <!-- TODO: Embed Image URI -->
    <!-- TODO: Allow adding items using search-series -->
    <!-- TODO: Add save button -->
    <!-- TODO: Add Sortable back for entries -->
    <!-- TODO: Add Chunk List -->
</template>
