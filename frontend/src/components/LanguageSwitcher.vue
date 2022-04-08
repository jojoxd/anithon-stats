<script setup lang="ts">
  import { useLanguageSwitcher, Language } from "../composition/useLanguageSwitcher";
  import { watch, ref } from "vue";

  const { language, setLanguage } = useLanguageSwitcher();

  const selection = ref<Language>(Language.English);

  const indexedLanguage = Object.values(Language).filter(val => typeof val as any === 'string');

  watch(language, () => {
    selection.value = language.value;
  }, { immediate: true });

  watch(selection, () => {
    setLanguage(selection.value);
  });
</script>

<template>
  {{ language }}

  <select v-model="selection">
    <option v-for="(name, idx) in indexedLanguage" :value="idx">{{ name }}</option>
  </select>
  Language Switcher
</template>

<style scoped lang="scss">

</style>