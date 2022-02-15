<script setup lang="ts">
  import {useVModel} from "@vueuse/core";
  import {ref, watch} from "vue";

  const props = defineProps({
    entry: {
      type: Object /* IEntry */
    }
  });

  const autosplit = ref(true);
  const entry = useVModel(props, 'entry');

  watch(autosplit, () => {
    if(autosplit.value) {
      entry.value.savedData.split = undefined;
    } else {
      entry.value.savedData.split = entry.value.savedData.split ?? 1;
    }
  });

  watch(entry, () => {
    autosplit.value = !entry.value.savedData.split;
  }, { immediate: true });
</script>

<template>
  <div class="entry-control">

    <div class="form-control">
      <label>Multiplier</label>

      <input type="number" min="1" max="2" step="0.1" v-model="entry.savedData.mult" />
    </div>

    <div class="form-control start-at" v-show="entry.episodes > 1">
      <label>Start At</label>

      <input type="number" v-model="entry.savedData.startAt" min="0" :max="entry.series.episodes - 1" />
    </div>

    <div class="form-control autosplit" v-show="entry.episodes > 1">
      <label>Auto Split</label>
      <input type="checkbox" v-model="autosplit" name="AutoSplit" />
    </div>

    <div class="form-control split" v-show="entry.episodes > 1 && !autosplit">
      <label>Split</label>

      <input type="number" min="1" :max="entry.episodes" v-model="entry.savedData.split" />
    </div>
  </div>
</template>

<style scoped lang="scss">
  .entry-control {
    display: inline;
  }
</style>