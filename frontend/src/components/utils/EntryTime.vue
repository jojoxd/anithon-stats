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
    return (entry.series.duration * entry.savedData.mult);
  });

  const totalDuration = computed(() => {
    return (entries || [entry]).reduce((a, e) => a + getTotalEpisodeDuration(e), 0);
  });

  const getEpisodeDuration = (entry) => entry.series.duration * entry.savedData.mult;
  const getTotalEpisodeDuration = (entry) => getEpisodeDuration(entry) * entry.episodes;

  const toHM = (minutes: number) => minutes > 10 ? `${Math.floor(minutes / 60)}:${(minutes % 60).toFixed(0)}` : `${minutes.toFixed(0)}`;
</script>

<template>
  <span class="entry-time">
    <span v-for="(_entry, idx) in _entries">
      <span v-if="_entry.episodes > 1">
        <span class="episodes">
          {{ _entry.episodes }}

          <span v-if="_entry.series.episodes !== null && _entry.series.episodes !== _entry.episodes">(of {{ _entry.series.episodes }})</span>
        </span>
        &times;
      </span>

      <span class="episode-duration">{{ toHM(getEpisodeDuration(_entry)) }}m</span>

      <span v-if="(idx + 1) < (_entries.length)">
        &plus;
      </span>
    </span>

    <span v-if="_entries.length > 0">
      &equals;
    </span>

    <span class="total-duration">{{ toHM(totalDuration) }}</span>
  </span>
</template>