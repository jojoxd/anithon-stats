<script setup lang="ts">
  import {useChunks} from "../../../composition/useChunks";
  import {ApiStatus} from "../../../composition/useApi";
  import {reactive, ref} from "vue";
  import {useEntries} from "../../../composition/useEntries";

  const props = defineProps({
    user: {
      type: String,
      required: true,
    },

    list: {
      type: String,
      required: true,
    },
  });

  const { user, list } = reactive(props);

  const {
    data: chunkData,
    status,
    reload: reloadChunks
  } = useChunks(user, list);

  const {
    data: entryData,
    status: entryStatus,
    reload: reloadEntries,
    updateSavedData,
  } = useEntries(user, list);

  const updating = ref(false);

  async function update()
  {
    updating.value = true;

    await updateSavedData();

    await reloadEntries();
    await reloadChunks();

    updating.value = false;
  }

  function allowDrag()
  {
    return !updating.value;
  }

  function updateOrder()
  {
    let idx = 0;
    for(const entry of entryData.value) {
      entry.savedData.order = idx++;
    }
  }

  console.log(user, list, status);
</script>

<template>
  <h1>{{ list }}</h1>

  <button @click="update()">Update</button>

  <div v-if="entryData">
    <Sortable v-model:items="entryData" :key="item => item.series.id" :prop-update="(entry, idx) => entry.savedData.order = idx">
      <template #item="{ item, up, down, index }">
        <ListEntry :entry="item" class="entry" @move-up="up" @move-down="down" :index="index" />
      </template>
    </Sortable>
  </div>

  <div v-if="status === ApiStatus.Fetching">
    Loading...
  </div>

  <div v-for="(chunk, index) of chunkData.chunks" v-if="status === ApiStatus.Ok">
    <Chunk :chunk="chunk" :index="index" />
  </div>
</template>

<style scoped lang="scss">

  //.entry {
  //  display: inline-block;
  //  width: 50%;
  //}

</style>