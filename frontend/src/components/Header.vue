<script lang="ts">
  import {computed, defineComponent} from "vue";
  import {useCurrentUser} from "../composition/useCurrentUser";

  export default defineComponent({
    setup() {
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
        return `/api/oauth/logout?redirect=${encodeURIComponent(window.location.href)}`;
      });

      const userListsUri = computed(() => {
        return `/${currentUser.value?.name}/lists`;
      });

      return {
        currentUser,

        avatarDescription,

        oauthUri,
        logoutUri,
        userListsUri,
      };
    }
  });
</script>

<template>
  <div class="header">
    <div class="title">
      <router-link to="/">AniStats</router-link>
    </div>

    <div class="spacer" />

    <div class="language-switcher">
      <LanguageSwitcher />
    </div>

    <div class="user-controls">
      <div class="user-display" v-if="currentUser !== null && currentUser.isAuthenticated">
        <img :src="currentUser?.avatar?.large" :alt="avatarDescription" />

        <div class="username">
          <router-link :to="userListsUri">{{ currentUser.name }}</router-link>
        </div>

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

    user-select: none;

    height: 4rem;

    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;

    position: fixed;
    top: 0;
    z-index: 2000;

    /* offset-x | offset-y | blur-radius | color */
    box-shadow: 0 5px 5px darken($background-color, 10%);

    $padding-width: 10vw;
    padding: 0 $padding-width;

    width: calc(100vw - 2 * #{$padding-width});

    .title
    {
      @extend %header-item;

      font-size: 1.75rem;

      & *, & ::v-deep *
      {
        color: $text-color !important;
        text-decoration: none;
      }
    }

    .spacer
    {
      flex-grow: 1;
    }

    & > .language-switcher
    {
      @extend %header-item;

      margin: .5rem;
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