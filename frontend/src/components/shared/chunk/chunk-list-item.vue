<script lang="ts">
	import { defineComponent, toRefs, computed, PropType } from "vue";
	import { get } from "@vueuse/core";
	import {IChunk} from "@anistats/shared";
	import {mdiAbacus, mdiCheck, mdiChevronDoubleRight, mdiClose, mdiPlay, mdiTimelineQuestionOutline} from "@mdi/js";
	import {useEntry} from "../../../composition/useEntry";
	import {storeToRefs} from "pinia";
	import {useAppStore} from "../../../composition/store/app-store";

	export default defineComponent({
		props: {
			chunk: {
				type: Object as PropType<IChunk>,
				required: true,
			},

			index: {
				type: Number,
				required: true,
			},

			hasProgressAfter: {
				type: Boolean,
				default: false,
			}
		},

		setup(props) {
			const {
				chunk,
				index,
				hasProgressAfter,
			} = toRefs(props);

			const { isDebugEnabled } = storeToRefs(useAppStore());

			const entry = computed(() => chunk.value.entry);

			const {
				title,
			} = useEntry(entry);

			const timelineData = computed(() => {
				const _chunk = get(chunk) as IChunk;
				const _hasProgressAfter = get(hasProgressAfter);

				// @TODO(#21): Need user progress (in episodes) to accurately define what chunk was the first to be dropped
				if(_chunk.entry.isDropped) {
				// if(_chunk.entry.isDropped && _chunk.start < _chunk.entry.episodes && _chunk.progress === 0) {
					return { icon: mdiClose, color: 'error' };
				}

				// @TODO(#22): We currently can't accurately pinpoint the currently playing anime,
				//             so mdiPlay case will be in this as well
				if(!_chunk.isComplete && (_chunk.progress === 0 || _hasProgressAfter)) {
					return { icon: mdiChevronDoubleRight, color: 'warning' };
				}

				if (_chunk.isComplete) {
					return { icon: mdiCheck, color: 'success' };
				}

				return { icon: mdiPlay, color: 'success' };
			});

			return {
				chunk,
				entry,

				index,
				title: computed(() => `${index.value + 1}. ${title.value}`),

				isDebugEnabled,

				timelineData,
			};
		},
	});
</script>

<template>
	<v-timeline-item :icon="timelineData.icon" :dot-color="timelineData.color">
		<!-- TODO(#23): Add back the anime cover image somehow -->
		<v-card :title="title">
			<v-card-text>
				<!-- TODO(#21): Add episode Progress of current chunk instead of percentage -->
				Progress: {{ (chunk?.progress ?? 0).toFixed(1) }}%
				<v-divider />
				<template v-if="chunk.end - chunk.start > 1">
					Episodes {{ chunk.start }} - {{ chunk.end }}
				</template>
				<template v-else>
					Episode {{ chunk.start }}
				</template>

				<template v-if="isDebugEnabled">
					<v-divider />
					Status: TODO
					<br/>
					Is Joined: {{ chunk.isJoined ? 'Yes' : 'No' }}
				</template>
			</v-card-text>
		</v-card>
	</v-timeline-item>
</template>
