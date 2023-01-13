<script lang="ts">
  import { defineComponent, PropType, ref, computed } from "vue";
  import {useVModels} from "@vueuse/core";
  import {UserId, UserResponse} from "@anistats/shared";
  import {useApi} from "../../composition/useApi";

  export default defineComponent({
    props: {
      userId: {
        type: String as unknown as PropType<UserId>,
        required: true,
      }
    },

    setup(props, { emit }) {
      const {
        userId,
      } = useVModels(props, emit);

      const {
        data: userResponse,
      } = useApi<void, UserResponse>('user/' + userId.value, ref(), true, 'GET');

      return {
        user: computed(() => {
          return userResponse.value?.user ?? null;
        }),
      };
    }
  });
</script>

<template>
  <UserLists v-if="user" :user="user" />
</template>

<style scoped lang="scss">
</style>
