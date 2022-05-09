<script lang="ts">
  import {computed, defineComponent, ref, watch} from "vue";
  import {useChunks} from "../../../composition/useChunks";
  import {useEntries} from "../../../composition/useEntries";
  import {useMetadata} from "../../../composition/useMetadata";
  import {useUser} from "../../../composition/useUser";
  import {useTitle} from "../../../composition/useTitle";
  import {ApiStatus} from "../../../composition/useApi";
  import {useVModels} from "@vueuse/core";
  import {useUserList} from "../../../composition/useUserList";
  import {IOverlayController} from "../../../plugin/overlay";

  declare const $overlay: IOverlayController;

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

    setup(props, { emit }) {
      const { user, list } = useVModels(props, emit);

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
        list: listData,
        reload: reloadUserList,
      } = useUserList(user, list);

      const {
        user: userData
      } = useUser(user);

      const host = computed(() => {
        return `${window.location.protocol}//${window.location.host}`;
      });

      const embedImageUri = computed(() => {
        return `${host.value}/api/${user.value}/list/${list.value}/image.png`;
      });

      const title = useTitle();

      watch([user, list], () => {
        title.value = `${user.value} / ${list.value}`;
      }, { immediate: true });

      async function update()
      {
        updating.value = true;

        for(const entry of entryData.value ?? []) {
          metadata.value!.savedData![entry.id] = entry.savedData;

          let _sequel = entry.sequel;
          while(_sequel) {
            metadata.value!.savedData![_sequel.id] = _sequel.savedData;

            _sequel = _sequel.sequel;
          }
        }

        await updateMetadata();

        await reloadEntries();
        await reloadChunks();
        await reloadMetadata();
        await reloadUserList();

        // Make the overlay feel more right (also less flashing)
        setTimeout(() => {
          updating.value = false;
        }, 1000);
      }

      watch([chunkStatus, entryStatus], () => {
        if(updating.value)
          return;

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

      return {
        user,
        list,
        listData,

        embedImageUri,

        update,

        userData,
        entryData,
        chunkData,

        chunkStatus,
        ApiStatus,
      }
    }
  });
</script>

<template>
  <div>
    <h1>{{user}} / {{ list }}</h1>

    <ListStats :list="listData" />

    <a :href="embedImageUri" target="_blank">Embed</a>

    <div class="form-control update" v-if="userData?.isCurrentUser ?? false">
      <button @click="update()">Update</button>
    </div>

    <div class="dev" v-if="entryData">
      <Sortable v-model:items="entryData" :keys="(entry) => entry.series.id" :enabled="userData?.isCurrentUser ?? false" :prop-update="(entry, idx) => entry.savedData.order = idx">
        <template #item="{ item, up, down, index, upEnabled, downEnabled }">
          <EntryContainer :entry="item" :user="userData" @move-up="up" @move-down="down" :up-enabled="upEnabled" :down-enabled="downEnabled" :index="index" />
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