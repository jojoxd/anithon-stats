<script setup lang="ts">
  import type {IChunk} from "@anistats/shared";
  import {computed, reactive, ref, watch} from "vue";

  /// <editor-fold desc="props">
  const props = defineProps({
    chunk: {
      type: Object /* IChunk */,
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
  });

  const {
    chunk,
    index,
    progress
  } = reactive(props) as any as {
    chunk: IChunk,
    index: number,
    progress: boolean
  };
  /// </editor-fold>

  /// <editor-fold desc="Progress">
  const progressElement = ref<HTMLElement | null>(null);

  watch([chunk, progressElement], () => {
    if(progressElement.value)
      progressElement.value.style.height = `${(chunk.progress ?? 0).toFixed(0)}%`;
  }, { immediate: true });
  /// </editor-fold>

  /// <editor-fold desc="Chunk Data">
  const debug = true;
  const data = computed(() => [
      ['progress', `${(chunk.progress ?? 0).toFixed(1)}%`],

      [
        chunk.end - chunk.start > 0 ? 'episodes' : 'episode',
        chunk.end - chunk.start > 0 ? `${chunk.start} - ${chunk.end}` : `${chunk.start}`
      ],

      ...(debug ? [
          ['dbg.status', 'TODO'],

          ['dbg.is-joined', chunk.isJoined]
      ] : []),
  ]);
  /// </editor-fold>
</script>

<template>
  <div class="chunk">
    <div class="chunk-progress" ref="progressElement" v-if="progress"></div>

    <div class="chunk-content">
      <div class="chunk-image">
        <img :src="chunk.entry.series.coverImage" :alt="`Cover image of ${chunk.entry.series.title.romaji}`"/>
      </div>

      <div class="chunk-data">
        <h3>{{ index + 1 }}. {{ chunk.entry.series.title.romaji }}</h3>

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
