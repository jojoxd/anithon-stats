<script lang="ts">
	import { defineComponent } from "vue";
	import {useVModel} from "@vueuse/core";
	import {IListMetadata} from "@anistats/shared/src/IListMetadata";

	export default defineComponent({
		props: {
			modelValue: {
				type: Object as PropType<IListMetadata>,
				required: true,
			},
		},

		emits: [
			'update:modelValue'
		],

		setup(props, { emit }) {
			const listSettings = useVModel(props, 'modelValue', emit);

			return {
				listSettings,
			};
		},
	});
</script>

<template>
	<v-checkbox-btn
		label="Allow Chunk Merge"
		v-model="listSettings.allowChunkMerge"
	></v-checkbox-btn>

	<v-text-field
		type="number"
		v-model="listSettings.maxChunkLength"
		label="Max Chunk Length (Minutes)"
	>
		<template #details>
			Maximum length a chunk can be in minutes.
		</template>
	</v-text-field>

	<v-text-field
		type="number"
		v-model="listSettings.maxChunkJoinLength"
		label="Max Chunk Join Length"
	>
		<template #details>
			Maximum length in minutes that can join a chunk.
		</template>
	</v-text-field>
</template>
