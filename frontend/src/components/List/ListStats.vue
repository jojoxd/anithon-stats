<script lang="ts">
  import {defineComponent, PropType} from "vue";
  import {IListData} from "@anistats/shared";
  import {useVModels} from "@vueuse/core";

  export default defineComponent({
    props: {
      list: {
        type: Object as PropType<IListData["value"]>,
        required: true,
      },
    },

    setup(props, { emit })
    {
      const { list } = useVModels(props, emit);

      return {
        list,
      };
    }
  });
</script>

<template>
  <div class="stats">
    <div class="total-duration">
      <span>Total Duration</span>
      <span>{{ $moment.duration(list?.totalDuration, 'minutes').format() }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>