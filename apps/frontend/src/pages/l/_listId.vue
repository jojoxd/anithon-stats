<script lang="ts">
    import {defineComponent, PropType, ref} from "vue";
    import {useVModels} from "@vueuse/core";
    import {mdiContentSave, mdiDragVertical} from "@mdi/js";
    import {ListId} from "@anistats/shared";
    import {storeToRefs} from "pinia";
    import {useListStore} from "../../lib/store/list-store";
    import {useCurrentListUser} from "../../lib/composition/user/use-current-list-user.fn";
    import {useRootEntries} from "../../lib/composition/entry/use-root-entries.fn";
    import {useBreakpoints} from "../../lib/composition/app/use-breakpoints.fn";

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

            const {
                isMobile,
            } = useBreakpoints();

            return {
                currentList,
                currentEntry,
                rootEntries,
                user,
                embedImageUri,
                metadata,
                hasUnsavedChanges,

                isMobile,

                canEdit,

                mdiDragVertical,
                mdiContentSave,
            };
        },
    });
</script>

<template>
	<div v-if="currentList">
        <v-badge
            :model-value="hasUnsavedChanges"
            content="Unsaved Changes"
            color="warning"
            :offset-x="isMobile ? 0 : -10"
            :inline="isMobile"
        >
            <template v-if="isMobile">
                <h1 class="text-h5 mobile-title pr-2 text-truncate">{{ metadata.title }}</h1>
            </template>
            <template v-else>
                <h1>{{ user?.name }} / {{ metadata.title }}</h1>
            </template>
        </v-badge>

        <p>{{ metadata.description }}</p>

        <list-metadata :metadata="metadata" />

        <list-settings-card v-if="canEdit" />

        <h2>Entries</h2>

        <div class="entries" v-if="rootEntries">
            <slick-slick-list
                v-model:list="rootEntries"
                :item-key="(entryView) => entryView.id"
                axis="y"
                use-drag-handle
                use-window-as-scroll-container
            >
                <template #item="{ item: rootEntry }">
                    <entry-card
                        :entry-id="rootEntry.id"
                        with-handle
                    ></entry-card>
                </template>
            </slick-slick-list>
        </div>

        <entry-settings-drawer :open="currentEntry !== null" />
    </div>

    <!-- TODO: Embed Image URI -->
    <!-- TODO: Allow adding items using search-series -->
    <!-- TODO: Add save button -->
    <!-- TODO: Add Sortable back for entries -->
    <!-- TODO: Add Chunk List -->
</template>

<style scoped lang="scss">
    .mobile-title {
        max-width: 60vw;
    }
</style>