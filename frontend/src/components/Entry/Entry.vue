<script lang="ts">
  import {computed, defineComponent, PropType, ref, watch} from "vue";
  import {IAnilistUserMetadata, IEntry} from "@anistats/shared";
  import {useVModels} from "@vueuse/core";
  import {useBreakpoints} from "../../composition/useBreakpoints";
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
        default: -1
      },

      user: {
        type: Object as PropType<IAnilistUserMetadata>,
        required: true
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

    setup(props, { emit })
    {
      const { entry, index, user, upEnabled, downEnabled } = useVModels(props, emit);

      const {
        title,
        description,
        cover,
        duration: {
          totalDuration,
          episodeDuration,
          episodes
        },
      } = useEntry(entry);

      const anilistUrl = computed(() => {
        return `https://anilist.co/anime/${entry.value!.series.id}`;
      });

      const { mobile: isMobile } = useBreakpoints();

      const descriptionShown = ref(true);

      watch(isMobile, () => {
        descriptionShown.value = !isMobile.value;
      }, { immediate: true });

      const upStyle = computed(() => {
        if(!upEnabled.value)
          return { color: "red" };

        return {};
      });

      const downStyle = computed(() => {
        if(!downEnabled.value)
          return { color: "red" };

        return {};
      });

      // @TODO: Cleanup these returns?
      return {
        entry,
        index,
        user,
        title,
        description,
        cover,
        totalDuration,
        episodeDuration,
        episodes,

        anilistUrl,
        isMobile,
        descriptionShown,

        upEnabled,
        upStyle,

        downEnabled,
        downStyle,
      }
    }
  });
</script>

<template>
  <div class="entry" :class="{ edit: user?.isCurrentUser ?? false }">
    <!-- @TODO: Grey out chevrons if impossible to move that direction instead of fully removing the chevron -->
    <div class="entry-order" v-if="index >= 0">
      <span>
        <icon-mdi-chevron-up class="chevron" @click="upEnabled && $emit('move-up')" :class="{ disabled: !upEnabled }" />
      </span>

      <span class="entry-index">
        {{ index + 1 }}
      </span>

      <span>
        <icon-mdi-chevron-down class="chevron" @click="downEnabled && $emit('move-down')" :class="{ disabled: !downEnabled }" />
      </span>
    </div>

    <div class="entry-image">
      <img :src="cover" :alt="`Cover Image of ${title}`" />
    </div>

    <div class="entry-title">{{ title }}</div>

    <!-- TODO: #2 Cleanup .entry-meta span appearance -->
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

    <div class="entry-settings" v-if="user?.isCurrentUser ?? false">
      <EntrySettings :entry="entry" />
    </div>
  </div>
</template>

<style scoped lang="scss">
  @import "$$component-utils";

  .entry {
    display: grid;

    @extend %card;

    // Non-edit grid-template
    grid-template:
      [row1-start] "order image title title"    2rem [row1-end]
      [row2-start] "order image meta  meta" 2rem [row2-end]
      [row3-start] "order image desc  desc" calc(#{$image-height}rem - 2rem - 2rem) [row3-end]
                 /  3rem  #{$image-width}rem  1fr  1fr;

    &.edit {
      grid-template:
      [row1-start] "order image title title"    2rem [row1-end]
      [row2-start] "order image meta  settings" 2rem [row2-end]
      [row3-start] "order image desc  settings" calc(#{$image-height}rem - 2rem - 2rem) [row3-end]
                 /  3rem  #{$image-width}rem  1fr  1fr;
    }

    @include respond(mobile) {
      // Non-edit mobile grid-template
      grid-template:
        [row1-start] "order .     image" calc(#{$image-height}rem + 1rem) [row1-end]
        [row2-start] "title title title" 1fr [row2-end]
        [row3-start] "meta  meta  meta" auto [row3-end]
        [row4-start] "desc  desc  desc" auto [row4-end]
                   / 2rem   1fr calc(#{$image-width}rem + 1rem);

      &.edit {
        grid-template:
        [row1-start] "order .     image" calc(#{$image-height}rem + 1rem) [row1-end]
        [row2-start] "title title title" 1fr [row2-end]
        [row3-start] "meta  meta  meta" auto [row3-end]
        [row4-start] "desc  desc  desc" auto [row4-end]
        [row5-start] "settings settings settings" auto [row5-end]
                   / 2rem   1fr calc(#{$image-width}rem + 1rem);
      }
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

      .chevron
      {
        cursor: pointer;
        color: $text-color;
        font-size: 1.5rem;

        &.disabled {
          color: darken($text-color, 30%);
          cursor: not-allowed;
        }
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

          & a {
            color: darken($text-color, 70%) !important;
          }
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
