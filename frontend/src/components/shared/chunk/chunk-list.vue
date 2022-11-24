<script lang="ts">
	import { defineComponent, toRefs } from "vue";
	import {IChunk} from "@anistats/shared";
	import { get } from "@vueuse/core";

	export default defineComponent({
		props: {
			chunks: {
				type: Array as PropType<Array<IChunk>>,
				required: true,
			},
		},

		setup(props) {
			const {
				chunks
			} = toRefs(props);

			function hasProgressAfter(currentIdx: number): boolean
			{
				const _chunks = get(chunks);

				return _chunks.slice(currentIdx + 1).some((chunk: IChunk) => chunk.progress > 0);
			}

			return {
				chunks,

				hasProgressAfter,
			};
		},
	});
</script>

<template>
	<v-timeline side="end">
		<template v-for="(chunk, idx) in chunks" :key="idx">
			<chunk-list-item :chunk="chunk" :index="idx" :has-progress-after="hasProgressAfter(idx)" />
		</template>
	</v-timeline>
</template>
