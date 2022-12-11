<script lang="ts">
	import { defineComponent, toRefs, PropType } from "vue";
	import { mdiApps, mdiChevronDown, mdiChevronUp } from "@mdi/js";
	import {IEntry} from "@anistats/shared";
	import {useEntry} from "../../composition/useEntry";

	export default defineComponent({
		props: {
			entry: {
				type: Object as PropType<IEntry>,
				required: true,
			},

			index: {
				type: Number,
				required: false,
				default: NaN,
			},

			upEnabled: {
				type: Boolean,
				required: false,
				default: true,
			},

			downEnabled: {
				type: Boolean,
				required: false,
				default: true,
			},
		},

		emits: [
			'move-up',
			'move-down',
		],

		setup(props, { emit }) {
			const {
				entry,
				index,
				upEnabled,
				downEnabled,
			} = toRefs(props);

			const { title, sequels, duration } = useEntry(entry);

			console.log(entry);

			return {
				title,
				entry,
				sequels,
				index,
				duration,

				moveUp: () => upEnabled.value && emit('move-up'),
				moveDown: () => downEnabled.value && emit('move-down'),

				upEnabled,
				downEnabled,

				mdiApps,
				mdiChevronUp,
				mdiChevronDown,
			};
		},
	});
</script>

<template>
	<v-sheet class="d-flex flex-column">
		<v-system-bar class="position-static">
			<v-icon :icon="mdiApps" />

			<span>
				{{ title }}
				<template v-if="sequels.length > 0">
					&middot;
					{{ 1 + sequels.length }} series
				</template>
			</span>

			<v-spacer />
		</v-system-bar>

		<div class="d-flex flex-row mt-2">
			<div class="d-flex flex-column align-center entry-control">
				<v-icon
					:icon="mdiChevronUp"
					@click.prevent="moveUp"
					class="move-icon"
					:class="{ disabled: !upEnabled, }"
				></v-icon>

				<span>{{ index + 1 }}</span>

				<v-icon
					:icon="mdiChevronDown"
					@click.prevent="moveDown"
					class="move-icon"
					:class="{ disabled: !downEnabled, }"
				></v-icon>
			</div>

			<slot name="default" />
		</div>
	</v-sheet>
</template>

<style scoped lang="scss">
	.move-icon {
		cursor: pointer;
	}

	.move-icon.disabled {
		filter: brightness(20%);
		cursor: not-allowed;
	}

	.entry-control {
		width: 80px;
	}
</style>
