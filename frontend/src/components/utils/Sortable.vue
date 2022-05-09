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

      enabled: {
        type: Boolean,
        required: false,
        default: true,
      }
    },

    setup(props, { emit })
    {
      const { items, keys, propUpdate, enabled } = useVModels(props, emit);

      function moveUp(index: number)
      {
        return function moveUpInner()
        {
          if(!enabled.value)
            return;

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
          if(!enabled.value)
            return;

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
        if(!enabled.value)
          return;

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
    <slot name="item" :item="item" :index="index" :up="moveUp(index)" :up-enabled="index >= 1" :down="moveDown(index)" :down-enabled="index < (items.length - 1)"/>
  </div>
</template>