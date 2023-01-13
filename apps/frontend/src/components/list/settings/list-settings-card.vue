<script lang="ts">
	import { defineComponent, watch } from "vue";
  import {useListStore} from "../../../composition/store/list-store";
  import {storeToRefs} from "pinia";

	export default defineComponent({
		setup() {
			const listStore = useListStore();

			const {
			  listSettings,
      } = storeToRefs(listStore);

			watch(listSettings, () => {
			  listStore.setHasUnsavedChanges(true);
      }, { deep: true, });

			return {
				listSettings,
			};
		},
	});
</script>

<template>
  <v-card variant="outlined">
    <v-card-title>Settings</v-card-title>

    <v-card-text>
      <v-checkbox-btn
          label="Allow Chunk Merge"
          v-model="listSettings.allowChunkMerge"
          class="mb-2"
      ></v-checkbox-btn>

      <v-text-field
          type="number"
          v-model="listSettings.maxChunkLength"
          variant="outlined"
          class="mb-2"
          label="Max Chunk Length (Minutes)"
      >
        <template #details>
          Maximum length a chunk can be in minutes.
        </template>
      </v-text-field>

      <v-text-field
          type="number"
          v-model="listSettings.maxChunkJoinLength"
          variant="outlined"
          class="mb-2"
          label="Max Chunk Join Length"
      >
        <template #details>
          Maximum length in minutes that can join a chunk.
        </template>
      </v-text-field>
    </v-card-text>
  </v-card>
</template>
