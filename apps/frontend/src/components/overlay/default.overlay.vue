<script lang="ts">
  import { defineComponent, computed } from "vue";
  import {useOverlay} from "./use-overlay.composition";
  import {breakpointsVuetify, useBreakpoints, get} from "@vueuse/core";

  export default defineComponent({
    setup() {
      const overlay = useOverlay();
      const breakpoints = useBreakpoints(breakpointsVuetify);

      const isSmallScreen = breakpoints.smaller("md");

      const justify = computed(() => {
        return get(isSmallScreen) ? 0 : Math.floor((12 - get(cols)) / 2);
      });

      const cols = computed(() => {
        return get(isSmallScreen) ? 12 : 4;
      });

      return {
        overlay,

        content: overlay.content,
        title: overlay.title,
        showSpinner: overlay.showSpinner,

        justify,
        cols,
      };
    },
  });
</script>

<template>
  <div class="w-100 h-100 d-flex align-center justify-center flex-column disable-pointer-events">
    <div>{{ title }}</div>
    <div v-if="content">{{ content }}</div>

    <div v-if="showSpinner">
      <v-progress-circular indeterminate />
    </div>
  </div>
</template>

<style lang="scss">
  .disable-pointer-events {
    pointer-events: none;
  }
</style>