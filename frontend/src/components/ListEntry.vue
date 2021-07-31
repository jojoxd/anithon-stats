<script setup lang="ts">
  import {useVModel} from "@vueuse/core";
  import {reactive, ref, watch} from "vue";

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

    index: {
      type: Number,
      default: -1,
    }
  });

  const { isSequel, entry: entrySelf, index } = reactive(props);

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

      <div class="entry-modifiers">
        <span>
          <icon-mdi-chevron-up @click="$emit('move-up')" style="font-size: 1.5rem;" />
        </span>

        <span class="entry-index">{{ index + 1 }}</span>

        <span>
          <icon-mdi-chevron-down @click="$emit('move-down')" style="font-size: 1.5rem;" />
        </span>
      </div>

      <div class="entry-data">
        <EntryTime :entry="entry" />

        <div class="entry-control">
          <div class="multiplier">
            <label>Multiplier</label>
            <input type="number" min="1" max="2" step="0.1" v-model="entry.savedData.mult" />
          </div>

          <div class="start-at" v-show="entry.episodes > 1">
            <label>Start At</label>
            <input type="number" v-model="entry.savedData.startAt" />
          </div>

          <div class="order">
            <label>Order</label>

            {{ entry.savedData.order }}
          </div>
        </div>
      </div>

      <div v-if="sequels.length > 0" class="entry-sequels">
        <div class="entry-sequel" v-for="sequel in sequels">
          <Popper hover arrow disable-click-away>
            <img class="entry-sequel-cover" :src="sequel.series.coverImage" />

            <template #content>
              <h3 class="entry-sequel-title">{{ sequel.series.title.romaji }}</h3>

              <div class="entry-sequel-data">
                <EntryTime :entry="sequel" />
              </div>
            </template>
          </Popper>
        </div>

        <div class="entry-sequel-data">
          <EntryTime :entries="sequels" />
        </div>
      </div>
    </div>
</template>

<style lang="scss" scoped>
  @import "$$component-utils";

  .entry {
    background-color: $background-color;
    display: grid !important;

    max-width: 50vw;

    margin: 1rem;

    border-radius: .5rem;

    grid-template:
      [row1-start] "modifiers image               title   title" 2rem [row1-end]
      [row2-start] "modifiers image               sequels data"  calc(#{$image-height}rem - 2rem) [row2-end]
                 /  2.5rem      #{$image-width}rem  auto    auto;

    .entry-cover {
      grid-area: image;

      img {
        width: #{$image-width}rem;
        height: #{$image-height}rem;

        border-radius: .5rem;
      }
    }

    .entry-modifiers {
      grid-area: modifiers;

      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: flex-start;
      align-items: center;

      &:deep(svg) {
        cursor: pointer;
      }

      .entry-index {
        margin: -.4rem 0;
        user-select: none;
      }
    }

    .entry-title {
      grid-area: title;

      margin: 0;
      margin-left: .7rem;
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

      margin-left: .5rem;

      .entry-sequel {
        width: 5rem;

        display: inline-block;
        bottom: 0;

        margin: .2rem;

        .entry-sequel-title {
          font-size: 1.2rem;
          margin: .2rem 0;
        }

        .entry-sequel-data {

        }

        .entry-sequel-cover {
          width: 5rem;
          height: #{5 / $image-aspect-ratio}rem;

          border-radius: .25rem;
        }
      }
    }
  }
</style>