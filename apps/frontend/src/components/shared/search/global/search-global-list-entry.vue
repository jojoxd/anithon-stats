<script lang="ts">
  import { defineComponent, PropType, toRefs } from "vue";
  import {SearchGlobalListDto} from "@anistats/shared";

  export default defineComponent({
    props: {
      list: {
        type: Object as PropType<SearchGlobalListDto>,
        required: true,
      }
    },

    emits: [
      'click',
    ],

    setup(props, { emit }) {
      const {
        list,
      } = toRefs(props);

      return {
        list,

        onClick: () => emit('click')
      }
    },
  });
</script>

<template>
  <v-list-item
      @click="onClick"
      :title="list.name"
  ></v-list-item>
</template>