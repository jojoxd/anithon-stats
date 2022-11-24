<script lang="ts">
  import {defineComponent, ref, watch} from "vue";
	import {mdiTranslate} from "@mdi/js";
	import {storeToRefs} from "pinia";
	import {Language, useAppStore} from "../composition/store/app-store";

  export default defineComponent({
    setup() {
      const { language } = storeToRefs(useAppStore());

      const languages = Object.values(Language).filter(key => typeof key === "string").map((key) => ({ key, value: Language[key] }));

      return {
        language,
				languages,

				mdiTranslate
      };
    }
  });
</script>

<template>
	<v-select
		label="Title Translations"
		variant="underlined"
		v-model="language"
		:items="languages"
		item-title="key"
		item-value="value"
	></v-select>
</template>
