<script lang="ts">
	import { defineComponent, toRefs, computed, PropType } from "vue";
	import { get } from "@vueuse/core";
  import {ChunkDto, ChunkStateEnum} from "@anistats/shared";
  import {mdiCheck, mdiChevronDoubleRight, mdiClose, mdiPageNext, mdiPlay} from "@mdi/js";
	import {useEntry} from "../../../composition/useEntry";
	import {storeToRefs} from "pinia";
	import {useAppStore} from "../../../composition/store/app-store";

	export default defineComponent({
		props: {
			chunk: {
				type: Object as PropType<ChunkDto>,
				required: true,
			},

			index: {
				type: Number,
				required: true,
			},

			hasProgressAfter: {
				type: Boolean,
				default: false,
			},

      isLastChunk: {
        type: Boolean,
        default: false,
      },
		},

		setup(props) {
			const {
				chunk,
				index,
				hasProgressAfter,
        isLastChunk,
			} = toRefs(props);

			const { isDebugEnabled } = storeToRefs(useAppStore());

			const entry = computed(() => chunk.value.entry);

			const {
				title,
			} = useEntry(entry);

			const timelineData = computed(() => {
				const _chunk = get(chunk) as ChunkDto;
				const _hasProgressAfter = get(hasProgressAfter);
        const _isLastChunk = get(isLastChunk);

        switch(_chunk.state) {
          case ChunkStateEnum.NotStarted:
            if (_hasProgressAfter && !_isLastChunk) {
              return { icon: mdiChevronDoubleRight, color: 'warning', };
            }

            return { icon: mdiPageNext, color: 'info', };

          case ChunkStateEnum.Started:
            if (_hasProgressAfter) {
              return { icon: mdiChevronDoubleRight, color: 'warning', };
            }

            return { icon: mdiPlay, color: 'success', };

          case ChunkStateEnum.Complete:
            return { icon: mdiCheck, color: 'success', };

          case ChunkStateEnum.Dropped:
            return { icon: mdiClose, color: 'error', };
        }

        throw new Error(`ChunkStates exhausted: ${_chunk.state}`);
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
				{{ chunk?.progress }} / {{ chunk.end - chunk.start + 1 }} watched
				<v-divider />
				<template v-if="chunk.end - chunk.start > 1">
					Episodes {{ chunk.start }} - {{ chunk.end }}
				</template>
				<template v-else>
					Episode {{ chunk.start }}
				</template>

				<template v-if="isDebugEnabled">
					<v-divider />
					{{ chunk.state }}
					<br/>
					Is Joined: {{ chunk.isJoined ? 'Yes' : 'No' }}
				</template>
			</v-card-text>
		</v-card>
	</v-timeline-item>
</template>
