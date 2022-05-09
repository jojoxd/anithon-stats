<script lang="ts">
  import {defineComponent, ref, watch} from "vue";
  import {Language, useLanguageSwitcher} from "../composition/useLanguageSwitcher";

  export default defineComponent({
    setup() {
      const { language, setLanguage } = useLanguageSwitcher();

      const selection = ref<Language>(Language.English);

      const indexedLanguage = Object.values(Language).filter(val => typeof val as any === 'string');

      watch(language, () => {
        selection.value = language.value;
      }, { immediate: true });

      watch(selection, () => {
        setLanguage(selection.value);
      });

      const open = ref(false);

      function toggleMenu()
      {
        open.value = !open.value;
      }

      function onBlur()
      {
        setTimeout(() => {
          open.value = false;
        }, 250);
      }

      return {
        language,
        selection,
        indexedLanguage,
        open,

        toggleMenu,
        onBlur,
      }
    }
  });

</script>

<template>
  <div class="language-switcher" :class="{ open }" @mouseleave="onBlur">

    <div class="control" @click="toggleMenu">
      <icon-mdi-translate />
      <icon-mdi-chevron-right class="language-switcher-chevron" />
    </div>

    <div class="menu">
      <div v-for="(name, idx) in indexedLanguage" class="menu-item" :class="{ selected: language === idx }" @click="selection = idx">
        {{ name }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  @import "$$component-utils";

  .language-switcher
  {
    width: 3.5rem;
    height: 100%;

    &.open
    {
      .menu
      {
        display: flex !important;
        position: absolute;

        width: 15ch;

        flex-direction: column;
      }

      .language-switcher-chevron
      {
        transform: rotate(90deg);
      }
    }

    .control
    {
      display: flex;
      height: 100%;

      justify-content: center;
      align-content: center;

      & * {
        margin: auto 0;
      }
    }

    .menu
    {
      display: none;

      user-select: none;

      .menu-item {
        background-color: lighten($background-color, 10%);
        padding: 0 .25rem;

        &:nth-child(2n + 0)
        {
          background-color: lighten($background-color, 15%);
        }

        &:last-child
        {
          border-radius: 0 0 1rem 1rem !important;
        }

        &.selected
        {
          background-color: lighten($background-color, 2%);
        }
      }

      .language-switcher-chevron
      {
        transform: rotate(0);
      }
    }
  }
</style>