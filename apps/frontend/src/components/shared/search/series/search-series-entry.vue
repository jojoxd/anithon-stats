<script lang="ts">
  import {computed, defineComponent, PropType, toRefs} from "vue";
  import {SeriesDto} from "@anistats/shared";
  import {useSeriesTitle} from "../../../../composition/useSeriesTitle";

  export default defineComponent({
    props: {
      series: {
        type: Object as PropType<SeriesDto>,
        required: true,
      },

      selected: {
        type: Boolean,
        default: false,
      },

      disabled: {
        type: Boolean,
        default: false,
      },
    },

    emits: [
      'click',
    ],

    setup(props, { emit })
    {
      const {
        series,
        selected,
        disabled,
      } = toRefs(props);

      const { seriesTitle: title } = useSeriesTitle(computed(() => series.value.title));

      function onClick()
      {
        if (!disabled.value) {
          emit('click');
        }
      }

      return {
        series,
        onClick,
        title,
        selected,
      };
    }
  });
</script>

<template>
  <v-list-item
      :class="{ disabled, 'search-series-item': true, }"
      @click="onClick"
      :active="selected"
      :prepend-avatar="series.coverImage">
    <v-list-item-title class="search-series-item-title">{{ title }}</v-list-item-title>

    Hello
  </v-list-item>
</template>

<style lang="scss">
  .search-series-item {
    &.disabled {
      // @TODO: Make title strike-through

      .search-series-item-title {
        text-decoration: line-through;
      }
    }
  }
</style>