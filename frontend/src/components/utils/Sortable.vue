<script setup lang="ts">
  import {reactive} from "vue";

  const props = defineProps({
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
  });

  function moveUp(index: number)
  {
    return function moveUpInner()
    {
      console.log('moveUp', index);

      if(index === 0)
        return;

      // Swap Items
      [items[index - 1], items[index]] = [items[index], items[index - 1]];

      updateProperty();
    }
  }

  function moveDown(index: number)
  {
    return function moveDownInner()
    {
      console.log('moveDown', index);

      if(index + 1 >= items.length)
        return;

      // Swap Items
      [items[index + 1], items[index]] = [items[index], items[index + 1]];

      updateProperty();
    }
  }

  function updateProperty()
  {
    if(propUpdate) {
      for(let i = 0; i < items.length; i++) {
        propUpdate(items[i], i);
      }
    }
  }

  const { items, keys, propUpdate } = reactive(props);
</script>

<template>
  <div v-for="(item, index) of items" :key="(_item) => keys(_item)">
    <slot name="item" :item="item" :index="index" :up="moveUp(index)" :down="moveDown(index)" />
  </div>
</template>