<script lang="ts">
  import {defineComponent, PropType, watch, ref} from "vue";
  import {IEntry} from "@anistats/shared";
  import {useVModels} from "@vueuse/core";

  export default defineComponent({
    props: {
      entry: {
        type: Object as PropType<IEntry>,
        required: true,
      }
    },

    emits: [
        'update:entry'
    ],

    setup(props, { emit })
    {
      const { entry } = useVModels(props, emit);
      const autosplit = ref(true);

      const splitSequelEntry = ref(false);

      watch(autosplit, () => {
        if(autosplit.value) {
          entry.value.savedData.split = undefined;
        } else {
          entry.value.savedData.split = entry.value.savedData.split ?? 1;
        }
      });

      watch(splitSequelEntry, () => {
        entry.value.savedData.splitSequelEntry = splitSequelEntry.value || false;
      })

      watch(entry, () => {
        autosplit.value = !entry.value.savedData.split;
        splitSequelEntry.value = entry.value.savedData.splitSequelEntry ?? false;
      }, { immediate: true });

      return {
        entry,
        autosplit,
        splitSequelEntry,
      }
    }
  });
</script>

<template>
	<div>

		<v-text-field
			type="number"
			min="1"
			max="2"
			step="0.2"
			label="Multiplier"
			variant="underlined"
			v-model="entry.savedData.mult"
		></v-text-field>

		<v-text-field
      v-if="entry.series.episodes > 1"
			type="number"
			min="0"
			:max="entry.series.episodes - 1"
			step="1"
			label="Start At"
			variant="underlined"
			v-model="entry.savedData.startAt"
		></v-text-field>

		<v-checkbox
			v-if="entry.episodes > 1"
			v-model="autosplit"
			label="Autosplit"
		></v-checkbox>

		<v-text-field
			v-show="entry.episodes > 1 && !autosplit"
			type="number"
			min="1"
			:max="entry.episodes"
			step="1"
			v-model="entry.savedData.split"
			variant="underlined"
			label="Split"
		></v-text-field>

		<v-checkbox
			v-if="!!entry.sequel || splitSequelEntry === true"
			v-model="splitSequelEntry"
			label="Split Sequel"
		></v-checkbox>
	</div>
</template>

<style scoped lang="scss">
  .entry-control {
    display: inline;
  }
</style>
