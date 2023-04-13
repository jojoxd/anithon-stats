<script lang="ts">
	import {defineComponent, PropType, toRefs, computed, ref} from "vue";
	import {useEntry} from "../../../lib/composition/entry/use-entry.fn";
	import {useEntryUpdate} from "../../../lib/composition/entry/use-entry-update.fn";
	import {useChunkState} from "../../../lib/composition/chunk/use-chunk-state.fn";
	import {computedExtract} from "../../../lib/util/computed-extract.fn";
	import {get} from "@vueuse/core";

	export default defineComponent({
		props: {
			chunk: {
				type: Object as PropType<ChunkDto>,
				required: true,
			},

			hasProgressAfter: {
				type: Boolean,
				required: true,
			},

			isLastChunk: {
				type: Boolean,
				required: true,
			},
		},

		setup(props) {
			const {
				chunk,
				hasProgressAfter,
				isLastChunk,
			} = toRefs(props);

			const entryId = computedExtract(chunk, (chunk) => chunk?.entry.ref ?? null);

			const progressButtonLoading = ref(false);

			const {
				entryTitle,
				entry,
			} = useEntry(entryId);

			const {
				updateEntry,
			} = useEntryUpdate(entryId);

			const {
				icon,
				color,
			} = useChunkState(chunk, hasProgressAfter, isLastChunk);

			async function onProgressClick()
			{
				const _entry = get(entry);
				const isComplete = entry.episodes - 1 === entry.progress;

				if (progressButtonLoading.value) {
					return;
				}

				progressButtonLoading.value = true;

				try {
					await updateEntry(
						isComplete ? 'complete' : 'start',
						true,
						chunk
					);
				} catch(e) {
					console.log(e);
				}

				progressButtonLoading.value = false;
			}

			const progress = computed(() => {
				const _entry = get(entry);
				const _chunk = get(chunk);

				return Math.max(
					0,
					Math.min(
						_entry.episodes - _chunk.start + 1,
						Math.min(
							_entry.progress - _chunk.start + 1,
							_chunk.end
						),
					),
				);
			});

			const completion = computed(() => {
				const _chunk = get(chunk);
				const _progress = get(progress);

				const percentage = Math.min(_chunk.end, _progress) / (_chunk.end - _chunk.start + 1) * 100;

				return Number(percentage.toFixed(1));
			});

			const progressEnabled = computed(() => {
				const _completion = get(completion);

				return !(_completion - 0.1 > 99.0 && _completion + 0.1 < 101.0);
			});

			return {
				chunk,
				entry,

				icon,
				color,

				entryTitle,

				progress,
				completion,

				onProgressClick,
				progressEnabled,
				progressButtonLoading,
			};
		},
	});
</script>

<template>
	<v-timeline-item :icon="icon" :dot-color="color" fill-dot>
		<v-card class="min-card-width">
			<v-card-title class="pb-0 text-truncate">
				<v-progress-linear absolute :model-value="completion" color="success" />

				{{ entryTitle }}

				<debug :items="{
					chunkCollectionId: chunk.rootEntry.ref,
					entryProgress: entry.progress,
					chunkProgress: chunk.progress,
					asdf: chunk.end - chunk.start + 1,
				}"/>
			</v-card-title>
			<v-card-text>
				<chunk-metadata class="pt-0" :chunk="chunk" />

				<v-btn
					:loading="progressButtonLoading"
					variant="tonal"
					class="float-right ma-0 mb-4"
					v-if="progressEnabled"
					@click="onProgressClick"
				>+</v-btn>
			</v-card-text>
		</v-card>
	</v-timeline-item>
</template>

<style lang="scss">
	.min-card-width {
		min-width: 15vw;
	}
</style>