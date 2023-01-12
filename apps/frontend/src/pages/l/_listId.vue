<script lang="ts">
	import {computed, defineComponent, ref, watch} from "vue";
	import {useTitle} from "../../composition/useTitle";
	import {ApiStatus} from "../../composition/useApi";
	import {useVModels} from "@vueuse/core";
	import {useList} from "../../composition/composed/useList";
	import {mdiContentSave} from "@mdi/js";
  import {SeriesDto} from "@anistats/shared";
  import {useAddEntryFn} from "../../composition/useAddEntryFn";
  import {useSeriesTitle} from "../../composition/useSeriesTitle";
  import {useRemoveEntryFn} from "../../composition/useRemoveEntryFn";
  import {useOverlay} from "../../components/overlay/use-overlay.composition";
  import {storeToRefs} from "pinia";
  import {useListStore} from "../../composition/store/list-store";

	export default defineComponent({
    props: {
			listId: {
				type: String,
				required: true,
			},
		},

		setup(props, {emit}) {
			const {listId} = useVModels(props, emit);

			const host = computed(() => {
				return `${window.location.protocol}//${window.location.host}`;
			});

			const embedImageUri = computed(() => {
				return `${host.value}/api/embed/${userData.value?.name}/${listId.value}.png`;
			});

			const listStore = useListStore();

			listStore.loadList(listId.value);

			const {
			  currentList,
      } = storeToRefs(listStore);

			return {
			  currentList,

				mdiContentSave,
			};
		},
	});
</script>

<template>
	<div>
    {{ currentList }}
<!--		<h1>{{ userData?.name }} / {{ listData?.name }}</h1>-->

<!--		<ListStats :list="listData"/>-->

<!--		<list-settings-card v-model="listSettings" v-if="listSettings" />-->

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
