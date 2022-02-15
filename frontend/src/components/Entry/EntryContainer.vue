<script setup lang="ts">
  import type {Ref} from "vue";
  import {useVModel} from "@vueuse/core";
  import type {IEntry} from "@anistats/shared";
  import {useSequels} from "../../composition/entry/useSequels";

  const props = defineProps({
    entry: {
      type: Object, /* IEntry */
      required: true,
    },

    index: {
      type: Number,
      required: true,
    },
  });

  const entry = useVModel(props, "entry") as Ref<IEntry>;
  const index = useVModel(props, "index");
  const sequels = useSequels(entry);
</script>

<template>
  <div class="entry-container">
    <Entry :entry="entry" :index="index" @move-up="$emit('move-up')" @move-down="$emit('move-down')" />

    <template v-for="sequel of sequels">
      <Entry :entry="sequel" />
    </template>
  </div>
</template>

<style scoped lang="scss">
  @import "$$component-utils";

  .entry-container {
    margin: 1rem;

    @include respond(mobile) {
      margin: 1rem 0;
    }
  }
</style>
