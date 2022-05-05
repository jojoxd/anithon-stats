<script setup="{ $overlay }" lang="ts">
import {useChunks} from "../../../composition/useChunks";
import {computed, reactive, ref, watch} from "vue";
import {useEntries} from "../../../composition/useEntries";
import {useMetadata} from "../../../composition/useMetadata";
import {ApiStatus} from "../../../composition/useApi";

import {IOverlayController} from "../../../plugin/overlay";
import {useUser} from "../../../composition/useUser";
import {useVModel} from "@vueuse/core";

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

  const user = useVModel(props, "user");
  const list = useVModel(props, "list");
  const updating = ref<boolean>(false);

  const {
    data: chunkData,
    status: chunkStatus,
    responseStatus: chunkResponseStatus,
    reload: reloadChunks
  } = useChunks(user.value, list.value);

  const {
    data: entryData,
    status: entryStatus,
    responseStatus: entryResponseStatus,
    reload: reloadEntries,
  } = useEntries(user.value, list.value);

  const {
    data: metadata,
    updateMetadata,
    reload: reloadMetadata,
  } = useMetadata(user.value, list.value);

  const {
    user: userData
  } = useUser(user);

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

  watch([chunkStatus, entryStatus], () => {
    if(chunkStatus.value !== ApiStatus.Ok || entryStatus.value !== ApiStatus.Ok) {
      if(chunkStatus.value === ApiStatus.Failure) {
        $overlay.show(`Something went wrong fetching chunks (${chunkResponseStatus.value})`, `<a href="${window.location.href}">Reload</a>`, false);
        return;
      }

      if(entryStatus.value === ApiStatus.Failure) {
        $overlay.show(`Something went wrong fetching entries (${entryResponseStatus.value})`, `<a href="${window.location.href}">Reload</a>`, false);
        return;
      }

      $overlay.show("Loading", null, true);
    } else {
      $overlay.hide();
    }
  }, { immediate: true });

  watch(updating, () => {
    if(updating.value) {
      $overlay.show("Updating", null, true);
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

    <div class="form-control update" v-if="userData.isCurrentUser">
      <button @click="update()">Update</button>
    </div>

    <div class="dev" v-if="entryData">
      <Sortable v-model:items="entryData" :keys="(entry) => entry.series.id" :prop-update="(entry, idx) => entry.savedData.order = idx">
        <template #item="{ item, up, down, index }">
          <EntryContainer :entry="item" :user="userData" @move-up="up" @move-down="down" :index="index" />
        </template>
      </Sortable>
    </div>

    <div v-for="(chunk, index) of chunkData.chunks" v-if="chunkStatus === ApiStatus.Ok">
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