<script lang="ts">
	import {defineComponent, PropType, toRefs, computed} from "vue";
	import {useEntry} from "../../../lib/composition/entry/use-entry.fn";
	import {computedExtract} from "../../../lib/util/computed-extract.fn";
	import {get} from "@vueuse/core";

	export default defineComponent({
		props: {
			chunk: {
				type: Object as PropType<ChunkDto>,
				required: true,
			},
		},

		setup(props) {
			const { chunk, } = toRefs(props);

			const entryId = computedExtract(chunk, (chunk) => chunk?.entry.ref ?? null);

			const {
				entryTitle,
			} = useEntry(entryId);

			const completion = computed(() => {
				const _chunk = get(chunk);

				return _chunk.progress / (_chunk.end - _chunk.start) * 100;
			});

			return {
				chunk,

				entryTitle,

				completion,
			};
		},
	});
</script>

<template>
	<v-timeline-item>
		<v-card>
			<v-card-title>
				<v-progress-linear absolute :model-value="completion" color="success" />

				{{ entryTitle }}
			</v-card-title>
			<v-card-text>

				{{ completion }}% ({{ chunk.progress }})

				{{ chunk.start }} - {{ chunk.end }}
			</v-card-text>
		</v-card>
	</v-timeline-item>
</template>