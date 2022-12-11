<script lang="ts">
  import { defineComponent, watch } from "vue";
  import {useVModels} from "@vueuse/core";
  import {useTitle} from "../../composition/useTitle";

  export default defineComponent({
    props: {
      userName: {
        type: String,
        required: true,
      }
    },

    setup(props, { emit }) {
      const { userName } = useVModels(props, emit);

      const title = useTitle();

      watch(userName, () => {
        title.value = `Userlist of ${userName.value}`;
      }, { immediate: true });

      return { userName };
    }
  });
</script>

<template>
  <UserLists :user-name="userName" />
</template>

<style scoped lang="scss">
</style>
