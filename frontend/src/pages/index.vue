<script lang="ts">
  import {defineComponent, ref, watch} from "vue";
  import {useTitle} from "../composition/useTitle";

  export default defineComponent({
    setup()
    {
      const user = ref<string>(null);

      const title = useTitle();

      watch(user, () => {
        if(user.value?.length === 0) {
          title.value = null;
          return;
        }

        title.value = `Search ${user.value}`;
      });

      return { user };
    }
  });
</script>

<template>
  <div class="userlist-select">
    <div class="stage1">
      <h2>Your username</h2>

      <div class="form-control">
        <input v-model="user" placeholder="Username" />
      </div>
    </div>

    <UserLists :user="user" />
  </div>
</template>

<style scoped lang="scss">
  @import "$$component-utils";

  .userlist-select {
    text-align: center;

    display: flex;
    align-content: center;
    flex-wrap: wrap;

    min-height: calc(100vh - 6rem);

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