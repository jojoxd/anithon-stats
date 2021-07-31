<script setup lang="ts">
  import {computed, reactive} from "vue";
  import type {IEntry} from "@anistats/shared";

  const props = defineProps({
    entry: {
      type: Object /* IEntry */,
      required: false,
    },

    entries: {
      type: Array /* Array<IEntry> */,
      required: false
    },
  });

  const { entry, entries } = reactive<{ entry: IEntry }>(props);

  const _entries = computed(() => {
    return entries ?? [entry];
  });

  const episodeDuration = computed(() => {
    return entry.series.duration * entry.savedData.mult
  });

  const totalDuration = computed(() => {
    return (entries || [entry]).reduce((a, e) => a + getTotalEpisodeDuration(e), 0);
  });

  const getEpisodeDuration = (entry) => entry.series.duration * entry.savedData.mult;
  const getTotalEpisodeDuration = (entry) => getEpisodeDuration(entry) * entry.episodes;
</script>

<template>
  <span class="entry-time">
    <span v-for="(_entry, idx) in _entries">
      <span v-if="_entry.episodes > 1">
        <span class="episodes">{{ _entry.episodes }}</span>
        &times;
      </span>

      <span class="episode-duration">{{ getEpisodeDuration(_entry) }}m</span>

      <span v-if="(idx + 1) < (_entries.length)">
        &plus;
      </span>
    </span>

    <span v-if="_entries.length > 0">
      &equals;
    </span>

    <span class="total-duration">{{ totalDuration }}m</span>
  </span>
</template>