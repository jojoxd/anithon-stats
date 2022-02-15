<script setup lang="ts">

  import {useVModel} from "@vueuse/core";

  enum DisplayType {
    Small = "small",
    Large = "large"
  }

  const props = defineProps({
    displayType: {
      type: DisplayType,
      default: DisplayType.Large,
      required: false,
    },

    src: {
      type: String,
      required: true,
    },

    alt: {
      type: String,
      required: true,
    },
  });

  const displayType = useVModel(props, "displayType");

  const src = useVModel(props, 'src');
  const alt = useVModel(props, 'alt');
</script>

<template>
  <img :src="src" :class="[`display-type-${displayType}`]" :alt="alt" />
</template>

<style scoped lang="scss">
  @import "$$component-utils";

  img.display-type-small {
    @extend %series-cover-small;
  }

  img.display-type-large {
    @extend %series-cover;
  }
</style>