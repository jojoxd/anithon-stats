<script setup lang="ts">
  import {useVModel} from "@vueuse/core";
  import {computed, reactive, ref, watch} from "vue";

  /// <editor-fold desc="props">
  const props = defineProps({
    entry: {
      type: Object /* IEntry */,
      required: true,
    },

    isSequel: {
      type: Boolean,
      default: false,
    },
  });

  const { isSequel, entry: entrySelf } = reactive(props);

  const sequels = ref([]);
  watch(entrySelf, () => {
    sequels.value = [];
    let entry = entrySelf;

    while(entry.sequel) {
      sequels.value.push(entry.sequel);

      console.log('%s => SEQ %s', entrySelf.series.title.romaji, entry.series.title.romaji);

      entry = entry.sequel;
    }
  }, { immediate: true });

  const entry = useVModel(props, 'entry');
  /// </editor-fold>
</script>

<template>
    <div class="entry" :class="{ 'sequel': isSequel }">
      <div class="entry-cover">
        <img :src="entry.series.coverImage" />
      </div>

      <h2 class="entry-title">{{ entry.series.title.romaji }}</h2>

      <div class="entry-data">
        {{ entry.episodes }} &times; {{ entry.series.duration * entry.savedData.mult }}m = {{ entry.episodes * (entry.series.duration * entry.savedData.mult) }}m

        <div class="entry-control">
          <div class="multiplier">
            <label>Multiplier</label>
            <input type="number" min="1" max="2" step="0.1" v-model="entry.savedData.mult" />
          </div>

          <div class="start-at" v-show="entry.episodes > 1">
            <label>Start At</label>
            <input type="number" v-model="entry.savedData.startAt" />
          </div>
        </div>
      </div>

      <div v-if="sequels.length > 0" class="entry-sequels">
        <div class="entry-sequel" v-for="sequel in sequels">
          <img class="entry-sequel-cover" :src="sequel.series.coverImage" />
        </div>
      </div>
    </div>
</template>

<style lang="scss" scoped>
  @import "$$component-utils";

  //.entry {
  //  // Sequels
  //
  //  .entry-data-wrapper {
  //    img {
  //      @extend %series-cover;
  //    }
  //  }
  //
  //  &.sequel {
  //    .entry-data-wrapper {
  //      img {
  //        @extend %series-cover-small;
  //      }
  //    }
  //  }
  //
  //  .sequels {
  //    background-color: red;
  //  }
  //}

  // new styling
  .entry {
    background-color: $background-color;
    display: grid !important;

    max-width: 50vw;

    margin: 1rem;

    border-radius: .5rem;

    grid-template:
      [row1-start] "image         title   title" 2rem [row1-end]
      [row2-start] "image         sequels data"  calc(#{$image-height}rem - 2rem) [row2-end]
                 /  #{$image-width}rem  auto    auto;

    .entry-cover {
      grid-area: image;

      img {
        width: #{$image-width}rem;
        height: #{$image-height}rem;

        border-radius: .5rem;
      }
    }

    .entry-title {
      grid-area: title;

      margin: 0;
    }

    .entry-data {
      grid-area: data;
    }

    .entry-sequels {
      grid-area: sequels;

      display: flex;
      align-content: flex-start;
      justify-content: flex-start;
      align-items: flex-end;
      flex-direction: row;
      flex-wrap: nowrap;

      .entry-sequel {
        width: 5rem;

        display: inline-block;
        bottom: 0;

        .entry-sequel-cover {
          width: 100%;
          height: auto;
        }
      }
    }
  }
</style>