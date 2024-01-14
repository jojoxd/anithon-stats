<script lang="ts">
    import {defineComponent, PropType, computed} from "vue";
    import {useVModels} from "@vueuse/core";
    import {mdiDragVertical, mdiContentSaveOutline} from "@mdi/js";
    import {EntryId, ListId, SeriesDto} from "@anistats/shared";
    import {storeToRefs} from "pinia";
    import {useListStore} from "../../../lib/store/list.store";
    import {useCurrentListUser} from "../../../lib/composition/user/use-current-list-user.fn";
    import {useRootEntries} from "../../../lib/composition/entry/use-root-entries.fn";
    import {useBreakpoints} from "../../../lib/composition/app/use-breakpoints.fn";
	import {useCanEditCurrentList} from "../../../lib/composition/auth/use-can-edit-current-list.fn";

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

            const {
				canEdit,
			} = useCanEditCurrentList();

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

            const skeletonLoaderType = computed(() => {
                let edit = '';
                if (canEdit.value) {
                    edit = 'heading@5, button@2';
                }

                return `heading, paragraph, chip@3, divider, ${edit}, heading`;
            })

            function onRemoveEntry(entryId: EntryId): void
            {
                listStore.removeEntry(entryId);
            }

            function onAddSeries(series: Array<SeriesDto>): void
            {
                for(const _series of series) {
                    listStore.addEntryBySeries(_series);
                }
            }

            function searchSeriesDisabled(series: SeriesDto): boolean
            {
                return !!listStore.getSeries(series.id);
            }

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
                skeletonLoaderType,

                mdiDragVertical,

                mdiContentSaveOutline,
                onSaveClick: () => listStore.saveList(),

                onRemoveEntry,
                onAddSeries,

                searchSeriesDisabled,
            };
        },
    });
</script>

<template>
    <v-skeleton-loader :loading="!currentList" :type="skeletonLoaderType">
        Hello
    </v-skeleton-loader>

    <entry-card-skeleton v-for="i in 3" class="my-4" :loading="!currentList" />

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

		<div class="controls" v-if="canEdit">
	        <list-settings-card />

	        <v-btn
	            :prepend-icon="mdiContentSaveOutline"
	            @click.prevent="onSaveClick"
	        >
	            Save
	        </v-btn>

	        <search-series multiple @selected="onAddSeries" :is-disabled="searchSeriesDisabled" />
		</div>

        <h2>Entries</h2>

        <div class="entries" v-if="rootEntries">
            <slick-slick-list
                v-model:list="rootEntries"
                :item-key="(entryView) => entryView.id"
                axis="y"
				:should-cancel-start="canEdit ? undefined : () => true"
                use-drag-handle
                use-window-as-scroll-container
            >
                <template #item="{ item: rootEntry }">
                    <entry-card
                        :entry-id="rootEntry.id"
                        @click:remove="onRemoveEntry"
                        with-handle
                    ></entry-card>
                </template>
            </slick-slick-list>
        </div>

        <entry-settings-drawer
			v-if="canEdit"
			:open="currentEntry !== null"
		></entry-settings-drawer>
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