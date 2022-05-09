<script lang="ts">
  import {computed, defineComponent, PropType} from "vue";
  import {IEntry} from "@anistats/shared";
  import {useVModels} from "@vueuse/core";
  import {useEntry} from "../../composition/useEntry";
  import {useEntries} from "../../composition/useEntries";

  export default defineComponent({
    props: {
      user: {
        type: String,
        required: true,
      },

      list: {
        type: String,
        required: true,
      },
    },

    setup(props, { emit })
    {
      const { user, list } = useVModels(props, emit);

      const { data: entries } = useEntries(user, list);

      const totalDuration = computed(() => {
        let sum = 0;

        if(!entries.value)
          return;

        for(let entry of entries.value) {
          const { duration: { totalDuration } } = useEntry(entry);

          sum += totalDuration.value;
        }

        return sum;
      });

      return {
        entries,
        totalDuration,
      };
    }
  });
</script>

<template>
  <div class="stats">
    <div class="total-duration">
      <span>Total Duration</span>
      <span>{{ $moment.duration(totalDuration, 'minutes').format() }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>