<script lang="ts">
	import {defineComponent} from "vue";
	import {computedExtract} from "../../../lib/util/computed-extract.fn";
	import {storeToRefs} from "pinia";
	import {useListStore} from "../../../lib/store/list.store";
	import { get } from "@vueuse/core";
	import { ChunkDto } from "@anistats/shared";

	export default defineComponent({
		setup(props) {
			const listStore = useListStore();

			const {
				currentList,
				chunks,
			} = storeToRefs(listStore);

			const listTitle = computedExtract(currentList, (currentList) => currentList?.metadata.title ?? null);
			const listDescription = computedExtract(currentList, (currentList) => currentList?.metadata.description ?? null);

			function hasProgressAfter(index: number): boolean {
				const _chunks = get(chunks);
				return _chunks
					.slice(index + 1)
					.some((chunk: ChunkDto) => {
						return chunk.progress > 0;
					});
			}

			function isLastChunk(index: number): boolean {
				return get(chunks)?.length === index;
			}

			return {
				listTitle,
				listDescription,

				chunks,

				hasProgressAfter,
				isLastChunk,
			};
		},
	});
</script>

<template>
	<v-container>
		<v-card :title="listTitle">
			<v-card-text>{{ listDescription }}</v-card-text>
		</v-card>

		<v-timeline class="timeline" density="compact" align="center" side="end" truncate-line="end">
			<chunk-timeline-item
				v-for="(chunk, idx) in chunks"
				:key="chunk.id"
				:chunk="chunk"
				:has-progress-after="hasProgressAfter(idx)"
				:is-last-chunk="isLastChunk(idx)"
			></chunk-timeline-item>
		</v-timeline>
	</v-container>
</template>

<style scoped lang="scss">
	.timeline ::v-deep .v-timeline-item__body {
	    overflow: hidden;
	    padding: 0 0 0 32px;
		padding-inline-start: 32px;
	    max-width: -webkit-fill-available;
	}

</style>