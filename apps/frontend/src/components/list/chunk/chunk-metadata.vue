<script lang="ts">
	import { PropType, defineComponent, toRefs, computed } from "vue";
	import { computedExtract } from "../../../lib/util/computed-extract.fn";
	import { formatTime } from "../../../lib/filter/format-time.filter";
	import { useEntry } from "../../../lib/composition/entry/use-entry.fn";
	import { useSeries } from "../../../lib/composition/series/use-series.fn";
	import { get } from "@vueuse/core";

	export default defineComponent({
		props: {
			chunk: {
				type: Object as PropType<ChunkDto>,
				required: true,
			},
		},
		
		setup(props) {
			const {
				chunk,
			} = toRefs(props);
			
			const entryId = computedExtract(chunk, (chunk) => chunk.entry.ref);
			
			const {
				entry,
				entryData,
				seriesId,
			} = useEntry(entryId);
			
			const {
				series,
			} = useSeries(seriesId);
			
			const chunkDuration = computed(() => {
				const _chunk = get(chunk);
				const _series = get(series);
				const _entryData = get(entryData);
				
				return (_chunk.end - _chunk.start + 1) * _entryData.mult * _series.duration;
			});
			
			const episodeDuration = computed(() => {
				const _series = get(series);
				const _entryData =get(entryData);
				
				return _series.duration * _entryData.mult;
			});
			
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

				const percentage = Math.min(100, Math.min(_chunk.end, _progress) / (_chunk.end - _chunk.start + 1) * 100);

				return Number(percentage.toFixed(1));
			});

			const progressEnabled = computed(() => {
				const _completion = get(completion);

				return !(_completion - 0.1 > 99.0 && _completion + 0.1 < 101.0);
			});
			
			return {
				chunk,
				
				chunkDuration,
				episodeDuration,
				
				formatTime,
				
				progress,
				completion,
			};
		},
	});
</script>

<template>
	<v-chip-group disabled v-if="chunk">
		<v-chip>{{ chunk.start }} - {{ chunk.end }}</v-chip>
		<v-chip>{{ formatTime({ minute: chunkDuration, }) }}</v-chip>
		<v-chip>{{ formatTime({ minute: episodeDuration, }) }} / episode</v-chip>
		<v-chip>{{ completion }}%</v-chip>
	</v-chip-group>
</template>
