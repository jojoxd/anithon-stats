<script setup lang="ts">
  import {defineProps, ref, watch, computed} from "vue";
  import type { IEntry } from "@anistats/shared";
  import type { Ref } from "vue";
  import {useEntryTitle} from "../../composition/entry/useEntryTitle";
  import {useVModel} from "@vueuse/core";
  import {useEntryDescription} from "../../composition/entry/useEntryDescription";
  import {useEntryCover} from "../../composition/entry/useEntryCover";
  import {useBreakpoints} from "../../composition/useBreakpoints";
  import {useEntryDuration} from "../../composition/entry/useEntryDuration";

  const props = defineProps({
    entry: {
      type: Object, /* IEntry */
      required: true,
    },

    index: {
      type: Number,
      required: true
    },
  });

  const entry = useVModel(props, "entry") as Ref<IEntry>;
  const index = useVModel(props, "index");
  const title = useEntryTitle(entry);
  const description = useEntryDescription(entry);
  const cover = useEntryCover(entry);
  const { totalDuration, episodeDuration, episodes } = useEntryDuration(entry);

  const anilistUrl = computed(() => {
    return `https://anilist.co/anime/${entry.value!.series.id}`;
  });

  const { mobile: isMobile } = useBreakpoints();

  const descriptionShown = ref(true);

  watch(isMobile, () => {
    descriptionShown.value = !isMobile.value;
  }, { immediate: true });
</script>

<template>
  <div class="entry">
    <div class="entry-order" v-if="index >= 0">
      <span>
        <icon-mdi-chevron-up @click="$emit('move-up')" style="font-size: 1.5rem;" />
      </span>

      <span class="entry-index">
        {{ index + 1 }}
      </span>

      <span>
        <icon-mdi-chevron-down @click="$emit('move-down')" style="font-size: 1.5rem;" />
      </span>
    </div>

    <div class="entry-image">
      <img :src="cover" :alt="`Cover Image of ${title}`" />
    </div>

    <div class="entry-title">{{ title }}</div>

    <!-- TODO: Cleanup .entry-meta span appearance -->
    <div class="entry-meta">
      <span class="blue">{{ episodes }}<span v-if="episodes !== entry.series.episodes">&nbsp;(of {{ entry.series.episodes }})</span> episodes</span>
      <span class="purple">{{ $moment.duration(episodeDuration, 'minutes').format() }}/episode</span>

      <span class="green">{{ $moment.duration(totalDuration, 'minutes').format() }}</span>
      <span class="blue"><a :href="anilistUrl" target="_blank">To Anilist</a></span>
    </div>

    <div class="entry-desc">
      <div class="entry-desc-control" @click="descriptionShown = !descriptionShown">
        <span class="entry-desc-title">Description</span>
        <span class="caret" :class="[descriptionShown ? 'open' : 'closed']">
          <icon-mdi-chevron-right />
        </span>
      </div>

      <span v-html="description" v-if="descriptionShown"></span>
    </div>

    <div class="entry-settings">
      <EntrySettings :entry="entry" />
    </div>
  </div>
</template>

<style scoped lang="scss">
  @import "$$component-utils";

  .entry {
    display: grid;

    @extend %card;

    grid-template:
      [row1-start] "order image title title"    2rem [row1-end]
      [row2-start] "order image meta  settings" 2rem [row2-end]
      [row3-start] "order image desc  settings" calc(#{$image-height}rem - 2rem - 2rem) [row3-end]
                 /  3rem  #{$image-width}rem  1fr  1fr;

    @include respond(mobile) {
      grid-template:
        [row1-start] "order .     image" calc(#{$image-height}rem + 1rem) [row1-end]
        [row2-start] "title title title" 1fr [row2-end]
        [row3-start] "meta  meta  meta" auto [row3-end]
        [row4-start] "desc  desc  desc" auto [row4-end]
        [row5-start] "settings settings settings" auto [row5-end]
                   / 2rem   1fr calc(#{$image-width}rem + 1rem);
    }

    .entry-order {
      grid-area: order;

      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: flex-start;
      align-items: center;

      user-select: none;

      width: fit-content;

      &:deep(svg) {
        cursor: pointer;
      }

      .entry-index {
        margin: -.3rem 0;
      }
    }

    .entry-image {
      grid-area: image;

      img {
        @extend %series-cover;
      }

      @include respond(mobile) {
        margin: .5rem;
      }
    }

    .entry-title {
      grid-area: title;

      font-size: 1.5rem;
      margin-left: 1rem;
    }

    .entry-desc {
      grid-area: desc;
      margin-left: 1rem;

      overflow-y: auto;
      @include scrollbar(darken($text-color, 20%), $card-background);

      .entry-desc-control {
        display: none;
      }

      @include respond(mobile) {
        overflow-y: hidden;

        .entry-desc-control {
          display: flex;
          font-size: 1.15rem;

          flex-direction: row;
          align-content: center;
          justify-content: flex-start;
          align-items: center;

          .entry-desc-title {
            margin-top: -.5rem;
          }

          .caret {
            transition: transform 500ms;
            display: inline-block;
            transform: rotate(90deg);

            &.closed {
              transform: rotate(0deg);
            }
          }
        }
      }
    }

    .entry-meta {
      grid-area: meta;
      margin-left: 1rem;

      display: flex;
      justify-content: flex-start;
      gap: .4rem;

      flex-wrap: wrap;

      & > span {
        padding: .2rem;
        border-radius: .5rem;
        background-color: lighten($background-color, 40%);
        color: darken($text-color, 70%);
        text-wrap: none;

        margin-top: auto;
        margin-bottom: auto;

        &.blue {
          background-color: rgb(2, 169, 255);
        }

        &.purple {
          background-color: rgb(146, 86, 243);
        }

        &.green {
          background-color: rgb(104, 214, 57);
        }
      }
    }

    .entry-settings {
      grid-area: settings;
      position: relative;
      margin-left: calc(1rem + 1px);

      @include respond(mobile) {
        &::before {
          display: none;
        }
      }

      &::before {
        content: "";
        position: absolute;
        background-color: $text-color;

        width: 1px;
        height: 100%;
        bottom: 0;
        margin: 0 .5rem;
        left: -1rem;
      }
    }
  }
</style>
