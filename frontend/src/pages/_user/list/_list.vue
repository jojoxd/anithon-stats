<script setup="{ $overlay }" lang="ts">
  import {useChunks} from "../../../composition/useChunks";
  import {computed, reactive, ref, watch} from "vue";
  import {useEntries} from "../../../composition/useEntries";
  import {useMetadata} from "../../../composition/useMetadata";
  import {ApiStatus} from "../../../composition/useApi";

  import {IOverlayController} from "../../../plugin/overlay";

  declare const $overlay: IOverlayController;

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
  const updating = ref<boolean>(false);

  const {
    data: chunkData,
    status,
    reload: reloadChunks
  } = useChunks(user, list);

  const {
    data: entryData,
    status: entryStatus,
    reload: reloadEntries,
  } = useEntries(user, list);

  const {
    data: metadata,
    updateMetadata,
    reload: reloadMetadata,
  } = useMetadata(user, list);

  const host = computed(() => {
    return `${window.location.protocol}//${window.location.host}`;
  });

  async function update()
  {
    updating.value = true;

    for(const entry of entryData.value) {
      console.log('SD>>', entry.id, entry.series.title.romaji, entry.savedData);
      metadata.value!.savedData[entry.id] = entry.savedData;

      let _sequel = entry.sequel;
      while(_sequel) {
        metadata.value!.savedData[_sequel.id] = _sequel.savedData;

        _sequel = _sequel.sequel;
      }
    }

    await updateMetadata();

    await reloadEntries();
    await reloadChunks();
    await reloadMetadata();

    // Make the overlay feel more right (also less flashing)
    setTimeout(() => {
      updating.value = false;
    }, 1000);
  }

  watch([status, entryStatus], () => {
    console.log("$overlay = ", $overlay);

    if(status.value !== ApiStatus.Ok || entryStatus.value !== ApiStatus.Ok) {
      $overlay.show("Loading", true);
    } else {
      $overlay.hide();
    }
  }, { immediate: true });

  watch(updating, () => {
    if(updating.value) {
      $overlay.show("Updating", true);
    } else {
      $overlay.hide();
    }
  });
</script>

<template>
  <div>
    <h1>{{user}} / {{ list }}</h1>

    <div class="stats">
      TODO: Update this: EntryTime does not exist anymore, we need something like it for entryData here
    </div>

    <!-- @TODO: #1 Change :href to fully computed value -->
    <a :href="`${host}/api/${user}/list/${list}/image.png`" target="_blank">Embed</a>

    <div class="form-control update">
      <button @click="update()">Update</button>
    </div>

    <div class="dev" v-if="entryData">
      <Sortable v-model:items="entryData" :keys="(entry) => entry.series.id" :prop-update="(entry, idx) => entry.savedData.order = idx">
        <template #item="{ item, up, down, index }">
          <EntryContainer :entry="item" @move-up="up" @move-down="down" :index="index" />
        </template>
      </Sortable>
    </div>

    <!-- @TODO: #6 Change Loading... (apiStatus) to a generalized controller -->
    <div v-if="status === ApiStatus.Fetching">
      Loading...
    </div>

    <!-- @TODO: #6 Change Updating... (updating) to a generalized controller -->
    <div v-if="updating">
      Updating...
    </div>

    <div v-for="(chunk, index) of chunkData.chunks" v-if="status === ApiStatus.Ok">
      <Chunk :chunk="chunk" :index="index" />
    </div>
  </div>
</template>

<style scoped lang="scss">

  .form-control
  {
    &.update
    {
      grid-template:
      [row1-start] "input" 1.4rem [row1-end]
                 / 100% !important;

      input, button {
        width: 100%;
      }
    }
  }
</style>