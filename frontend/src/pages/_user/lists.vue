<script lang="ts">
  import { defineComponent, watch } from "vue";
  import {useVModels} from "@vueuse/core";
  import {useTitle} from "../../composition/useTitle";

  export default defineComponent({
    props: {
      user: {
        type: String,
        required: true,
      }
    },

    setup(props, { emit }) {
      const { user } = useVModels(props, emit);

      const title = useTitle();

      watch(user, () => {
        title.value = `Userlist of ${user.value}`;
      }, { immediate: true });

      return { user };
    }
  });
</script>

<template>
  <UserLists :user="user" />
</template>

<style scoped lang="scss">
</style>