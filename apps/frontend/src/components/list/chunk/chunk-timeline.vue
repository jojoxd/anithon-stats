<script lang="ts">
	import {defineComponent} from "vue";
	import {computedExtract} from "../../../lib/util/computed-extract.fn";
	import {storeToRefs} from "pinia";
	import {useListStore} from "../../../lib/store/list.store";

	export default defineComponent({
		setup(props) {
			const listStore = useListStore();

			const {
				currentList,
				chunks,
			} = storeToRefs(listStore);

			const listTitle = computedExtract(currentList, (currentList) => currentList?.metadata.title ?? null);
			const listDescription = computedExtract(currentList, (currentList) => currentList?.metadata.description ?? null);

			return {
				listTitle,
				listDescription,

				chunks,
			};
		},
	});
</script>

<template>
	<v-container style="max-width: 600px;">
		<v-card :title="listTitle">
			<v-card-text>{{ listDescription }}</v-card-text>
		</v-card>

		<v-timeline density="compact" side="end" truncate-line="end">
			<chunk-timeline-item
				v-for="chunk of chunks"
				:key="chunk.id"
				:chunk="chunk"
			></chunk-timeline-item>
		</v-timeline>
	</v-container>
</template>
