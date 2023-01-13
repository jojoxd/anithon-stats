<script lang="ts">
	import {computed, defineComponent, PropType, ref} from "vue";
	import {useVModels} from "@vueuse/core";
	import {mdiContentSave} from "@mdi/js";
  import {ListId} from "@anistats/shared";
  import {storeToRefs} from "pinia";
  import {useListStore} from "../../composition/store/list-store";

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
        listUser,
        embedImageUri,
        metadata,
        hasUnsavedChanges,
      } = storeToRefs(listStore);

			return {
			  currentList,
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

<!--		<v-btn :href="embedImageUri" target="_blank">Embed Image</v-btn>-->

<!--    <search-series @selected="addSeries($event)" :is-disabled="isSeriesDtoSearchItemDisabled" />-->

<!--		<template v-if="userData?.isCurrentUser ?? false">-->
<!--			<v-btn-->
<!--				variant="tonal"-->
<!--				color="success"-->
<!--				:prepend-icon="mdiContentSave"-->
<!--				@click.prevent="update"-->
<!--			>Update</v-btn>-->
<!--		</template>-->

<!--		<div class="dev" v-if="entryData">-->
<!--			<Sortable v-model:items="entryData" :keys="(entry) => entry.series.id" :enabled="userData?.isCurrentUser ?? false"-->
<!--								:prop-update="(entry, idx) => entry.savedData.order = idx">-->
<!--				<template #item="{ item, up, down, index, upEnabled, downEnabled }">-->
<!--					<EntryContainer :entry="item" :user="userData" @move-up="up" @move-down="down" :up-enabled="upEnabled"-->
<!--													:down-enabled="downEnabled" :index="index" @remove="removeSeries($event)"/>-->
<!--				</template>-->
<!--			</Sortable>-->
<!--		</div>-->

<!--		<chunk-list :chunks="chunkData.chunks" v-if="chunkStatus === ApiStatus.Ok" />-->
	</div>
</template>
