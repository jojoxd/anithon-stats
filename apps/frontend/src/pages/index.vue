<script lang="ts">
  import {defineComponent} from "vue";
  import {useCurrentUser} from "../composition/useCurrentUser";

  export default defineComponent({
    setup()
    {
      const {
        currentUser,
      } = useCurrentUser();

      return {
        currentUser,
      };
    }
  });
</script>

<template>
  <div v-if="currentUser?.isAuthenticated">
    <UserLists :user-name="currentUser.name" />
  </div>
  <div v-else>
    It's pretty empty here...
  </div>
</template>

<style scoped lang="scss">
</style>
