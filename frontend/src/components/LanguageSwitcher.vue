<script lang="ts">
  import {defineComponent, ref, watch} from "vue";
  import {Language, useLanguageSwitcher} from "../composition/useLanguageSwitcher";
	import {mdiTranslate} from "@mdi/js";

  export default defineComponent({
    setup() {
      const { language, setLanguage } = useLanguageSwitcher();

      const selection = ref<Language>(language.value);

      watch(selection, () => {
      	setLanguage(selection.value);
			});

      const languages = Object.values(Language).filter(key => typeof key === "string").map((key) => ({ key, value: Language[key] }));

      return {
        language,
        selection,
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
		v-model="selection"
		:items="languages"
		item-title="key"
		item-value="value"
	></v-select>
</template>
