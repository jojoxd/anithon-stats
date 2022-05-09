<script lang="ts">
  import { defineComponent } from "vue";
  import {useVModels} from "@vueuse/core";

  export default defineComponent({
    props: {
      items: {
        type: Array,
        required: true,
      },

      keys: {
        type: Function,
        required: true,
      },

      propUpdate: {
        type: Function,
        required: false,
      },
    },

    setup(props, { emit })
    {
      const { items, keys, propUpdate } = useVModels(props, emit);

      function moveUp(index: number)
      {
        return function moveUpInner()
        {
          console.log('moveUp', index);

          if(index === 0)
            return;

          // Swap Items
          [items.value[index - 1], items.value[index]] = [items.value[index], items.value[index - 1]];

          updateProperty();
        }
      }

      function moveDown(index: number)
      {
        return function moveDownInner()
        {
          console.log('moveDown', index);

          if(index + 1 >= items.value.length)
            return;

          // Swap Items
          [items.value[index + 1], items.value[index]] = [items.value[index], items.value[index + 1]];

          updateProperty();
        }
      }

      function updateProperty()
      {
        if(propUpdate.value) {
          for(let i = 0; i < items.value.length; i++) {
            propUpdate.value(items.value[i], i);
          }
        }
      }

      return {
        items,
        keys,

        moveUp,
        moveDown,
      }
    }
  });
</script>

<template>
  <div v-for="(item, index) of items" :key="(_item) => keys(_item)">
    <slot name="item" :item="item" :index="index" :up="moveUp(index)" :down="moveDown(index)" />
  </div>
</template>