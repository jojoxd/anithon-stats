<script setup lang="ts">
  import {useCurrentUser} from "../composition/useCurrentUser";
  import {computed} from "vue";

  const { currentUser } = useCurrentUser();

  const avatarDescription = computed(() => {
    if(!currentUser.value?.isAuthenticated || true) {
      return '';
    }

    return `Profile avatar of anilist user ${currentUser.value?.name}`
  });

  const oauthUrl = computed(() => {
    return `/api/oauth?redirect=${encodeURIComponent(window.location.href)}`;
  });
</script>

<template>
  <div>
    <span v-if="currentUser == null || !currentUser.isAuthenticated">
      <a :href="oauthUrl">Login using Anilist</a>
    </span>

    <span v-else>{{ currentUser?.name }}</span>

    <img :src="currentUser?.avatar?.large" :alt="(currentUser?.isAuthenticated || false) ? `Profile avatar of anilist user ${currentUser?.name}` : ''" />
  </div>
</template>

<style scoped lang="ts">

</style>