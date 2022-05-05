<script setup lang="ts">
  import type {Ref} from "vue";
  import {useVModel} from "@vueuse/core";
  import type {IAnilistUserMetadata, IEntry} from "@anistats/shared";
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

    user: {
      type: Object, /* IAnilistUserMetadata */
      required: true
    }
  });

  const entry = useVModel(props, "entry") as Ref<IEntry>;
  const index = useVModel(props, "index");
  const user = useVModel(props, "user") as Ref<IAnilistUserMetadata>;
  const sequels = useSequels(entry);
</script>

<template>
  <div class="entry-container">
    <Entry :entry="entry" :index="index" :user="user" @move-up="$emit('move-up')" @move-down="$emit('move-down')" />

    <template v-for="sequel of sequels">
      <Entry :entry="sequel" :user="user" />
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
