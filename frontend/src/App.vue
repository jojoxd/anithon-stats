<script setup lang="ts">
  import { ref, watch } from "vue";

  // @TODO: Create controller for overlays, use it here
  const updating = ref(false);
  watch(updating, () => {
    console.log('updating changed');
  });
</script>

<template>
  <main class="content" :class="{ updating }">
    <router-view v-model:updating="updating" />

    <div class="overlay" v-if="updating">
      <div class="overlay-updating" v-if="updating">
        <div class="overlay-inner">
          <div class="overlay-title">Updating</div>

          <div class="spinner">...</div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
  @use "sass:color";
  @import "$$component-utils";

  main.updating
  {
    overflow: hidden !important;
    height: 100vh;
  }

  .overlay {
    position: absolute;
    display: block;

    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    background-color: color.change(darken($background-color, 5%), $alpha: 0.9);

    margin-top: auto;
    margin-bottom: auto;

    .overlay-updating {
      height: 100%;
      .overlay-inner {
        display: flex;

        margin-top: auto;
        margin-bottom: auto;

        align-items: center;
        flex-direction: column;
        vertical-align: center;
      }
    }
  }
</style>
