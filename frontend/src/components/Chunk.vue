<script lang="ts">
  import {computed, ComputedRef, defineComponent, ref, watch, PropType} from "vue";
  import {IChunk, IEntry} from "@anistats/shared";
  import {useVModels} from "@vueuse/core";
  import {useEntry} from "../composition/useEntry";

  export default defineComponent({
    props: {
      chunk: {
        type: Object as PropType<IChunk>,
        required: true,
      },

      progress: {
        type: Boolean,
        default: true
      },

      index: {
        type: Number,
        required: true,
      },
    },

    setup(props, { emit }) {
      const { chunk, index, progress } = useVModels(props, emit);

      const entry: ComputedRef<IEntry> = computed(() => chunk.value.entry);
      const { title } = useEntry(entry);

      const progressElement = ref<HTMLElement | null>(null);

      watch([chunk, progressElement], () => {
        if(progressElement.value)
          progressElement.value.style.height = `${(chunk.value.progress ?? 0).toFixed(0)}%`;
      }, { immediate: true });

      const debug = true;

      // @TODO: #1 Cleanup data structure into a useX call?
      const data = computed(() => [
        ['progress', `${(chunk.value.progress ?? 0).toFixed(1)}%`],

        [
          chunk.value.end - chunk.value.start > 0 ? 'episodes' : 'episode',
          chunk.value.end - chunk.value.start > 0 ? `${chunk.value.start} - ${chunk.value.end}` : `${chunk.value.start}`
        ],

        ...(debug ? [
          ['dbg.status', 'TODO'],

          ['dbg.is-joined', chunk.value.isJoined]
        ] : []),
      ]);

      return {
        chunk,
        index,
        progress,
        entry,
        title,
        debug,
        data,
      };
    }
  });
</script>

<!-- TODO: #2 Cleanup appearance of Chunk.vue -->

<template>
  <div class="chunk">
    <div class="chunk-progress" ref="progressElement" v-if="progress"></div>

    <div class="chunk-content">
      <div class="chunk-image">
        <img :src="chunk.entry.series.coverImage" :alt="`Cover image of ${title}`"/>
      </div>

      <div class="chunk-data">
        <h3>{{ index + 1 }}. {{ title }}</h3>

        <div v-for="[title, data] of data">
          {{ title }}: {{ data }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  @import "$$component-utils";

  $image-aspect-ratio: 115 / 163;

  $image-height: 12.5rem;
  $image-width: #{$image-height * $image-aspect-ratio};
  $image-margin: 1rem;

  .chunk {
    height: #{$image-height + ($image-margin * 2)};
    display: grid;

    grid-template-columns: 2px 100%;

    .chunk-progress {
      grid-column-start: 1;
      width: 2px;
      background-color: red;
    }

    .chunk-content {
      grid-column-start: 2;
      display: grid;
      grid-template-columns: calc(#{$image-width} + #{$image-margin * 2}) 1fr;

      @include respond(mobile) {
        grid-template-columns: 100%;

        .chunk-image {
          display: none;
        }
      }

      .chunk-image {
        margin: 0 $image-margin;
        img {
          @extend %series-cover;
        }
      }

      .chunk-data {
        h3 {
          margin: 0 0 .5rem;
        }
      }
    }
  }
</style>
