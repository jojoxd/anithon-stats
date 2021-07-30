<script setup lang="ts">
  import type {Ref} from "vue";
  import {computed, ref} from "vue";
  import {useUserLists} from "../composition/useUserLists";
  import {ApiStatus} from "../composition/useApi";
  import {useRouter} from "vue-router";

  const user: Ref<string> = ref(null);
  const selectedList: Ref<string> = ref(null);

  const { lists, status } = useUserLists(user);

  const stage2 = computed(() => status.value === ApiStatus.Ok);

  const router = useRouter();
  function goToList() {
    if(user.value && selectedList.value) {
      router.push(`/${user.value}/list/${selectedList.value}`);
    }
  }
</script>

<template>
  <div class="userlist-select">

    <div class="stage1">
      <h2>Your username</h2>

      <input v-model="user" />

      <span v-if="![ApiStatus.Ok, ApiStatus.Initial].includes(status)">
        {{ status }}
      </span>
    </div>

    <div class="stage2" v-if="stage2">
      <h2>Select your list</h2>

      <div>
        <select v-model="selectedList">
          <option disabled selected :value="null">Select a list</option>
          <option v-for="list of lists" :value="list" :key="list">{{ list }}</option>
        </select>
      </div>

      <div>
        <button @click="goToList()">Go To List</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  @import "$$component-utils";

  .userlist-select {
    text-align: center;

    @include respond(mobile) {
      background-color: red;

      text-align: left !important;
    }
  }
</style>