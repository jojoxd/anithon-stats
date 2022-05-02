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

  const oauthUri = computed(() => {
    return `/api/oauth?redirect=${encodeURIComponent(window.location.href)}`;
  });

  const logoutUri = computed(() => {
    return '#todo';
  });
</script>

<template>
  <div class="header">
    <div class="title">
      <router-link to="/">AniStats</router-link>
    </div>

    <div class="language-switcher">
      <LanguageSwitcher />
    </div>

    <div class="user-controls">
      <div class="user-display" v-if="currentUser !== null && currentUser.isAuthenticated">
        <img :src="currentUser?.avatar?.large" :alt="avatarDescription" />

        <div class="username">{{ currentUser.name }}</div>

        <div class="logout">
          <a :href="logoutUri">Log out</a>
        </div>
      </div>

      <div class="user-login" v-if="currentUser === null || !currentUser.isAuthenticated">
        <a :href="oauthUri">Log in</a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  @import "$$component-utils";

  %header-item
  {
    line-height: 3rem;
    height: 3rem;
    margin: .5rem;
    vertical-align: center;
  }

  .header {
    background-color: lighten($background-color, 5%);

    height: 4rem;

    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-around;

    position: absolute;
    top: 0;

    width: 100%;

    .title
    {
      @extend %header-item;

      font-size: 1.75rem;
    }

    .language-switcher
    {
      @extend %header-item;
    }

    .user-controls {
      .user-display {
        display: flex;

        img
        {
          @extend %header-item;
        }

        .username,
        .logout
        {
          @extend %header-item;
        }
      }

      .user-login {
        @extend %header-item;
      }
    }
  }
</style>