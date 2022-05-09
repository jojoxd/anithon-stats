<script lang="ts">
  import { defineComponent, PropType } from "vue";
  import {IAnilistUserMetadata, IEntry} from "@anistats/shared";
  import {useVModels} from "@vueuse/core";
  import {useEntry} from "../../composition/useEntry";

  export default defineComponent({
    props: {
      entry: {
        type: Object as PropType<IEntry>,
        required: true,
      },

      index: {
        type: Number,
        required: true,
      },

      user: {
        type: Object as PropType<IAnilistUserMetadata>,
        required: true,
      },

      upEnabled: {
        type: Boolean,
        required: false,
        default: true,
      },
      downEnabled: {
        type: Boolean,
        required: false,
        default: true,
      },
    },

    setup(props, { emit })
    {
      const { entry, index, user, upEnabled, downEnabled } = useVModels(props, emit);

      const { sequels } = useEntry(entry);

      return {
        entry,
        index,
        user,
        sequels,

        upEnabled,
        downEnabled,
      };
    }
  })

</script>

<template>
  <div class="entry-container">
    <Entry :entry="entry" :index="index" :user="user" @move-up="$emit('move-up')" :up-enabled="upEnabled" :down-enabled="downEnabled" @move-down="$emit('move-down')" />

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
