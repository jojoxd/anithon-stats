<script setup lang="ts">
  import type {Ref} from "vue";
  import {computed, ref} from "vue";
  import {useUserLists} from "../composition/useUserLists";
  import {ApiStatus} from "../composition/useApi";
  import {useRouter} from "vue-router";

  // @TODO: #1 Fix instantiation of user and selectedList, it should be read from router or something
  const user: Ref<string> = ref(null);
  const selectedList: Ref<string> = ref(null);

  const { lists, status } = useUserLists(user);

  const stage2 = computed(() => status.value === ApiStatus.Ok);

  const router = useRouter();

  const oauthUrl = computed(() => {
    return `/api/oauth?redirect=${encodeURIComponent(window.location.href)}`;
  });

  function goToList() {
    if(user.value && selectedList.value) {
      router.push(`/${user.value}/list/${selectedList.value}`);
    }
  }
</script>

<template>
  <div class="userlist-select">

    <a :href="oauthUrl">Login using Anilist</a>

    <div class="stage1">
      <h2>Your username</h2>

      <div class="form-control">
        <input v-model="user" placeholder="Username" />
      </div>

      <span v-if="![ApiStatus.Ok, ApiStatus.Initial].includes(status)">
        {{ status }}
      </span>
    </div>

    <div class="stage2" v-if="stage2">
      <h2>Select your list</h2>

      <div class="form-control">
        <select v-model="selectedList">
          <option disabled selected :value="null">Select a list</option>
          <option v-for="list of lists" :value="list" :key="list">{{ list }}</option>
        </select>
      </div>

      <div class="form-control goto">
        <button @click="goToList()">Go To List</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  @import "$$component-utils";

  .userlist-select {
    text-align: center;

    display: flex;
    align-content: center;
    flex-wrap: wrap;

    height: 100vh;

    > div {
      width: 100%;
    }

    .form-control {
      display: block;

      input,
      select,
      button {
        width: 10% !important;

        min-width: 200px;

        @include respond(mobile) {
          width: 80vw !important;
        }
      }

      button {
        margin: 1rem;
      }
    }

    @include respond(mobile) {
      background-color: red;

      text-align: left !important;
    }
  }
</style>