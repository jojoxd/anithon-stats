<script lang="ts">
import {defineComponent} from "vue";
import {useVModels} from "@vueuse/core";
import {useUser} from "../../composition/useUser";
import {useUserLists} from "../../composition/useUserLists";
import {ApiStatus} from "../../composition/useApi";
import {UserIdentifierType} from "@anistats/shared";

export default defineComponent({
    props: {
      user: {
        type: String,
        required: true,
      },
    },

    setup(props, { emit }) {
      const { user: userName } = useVModels(props, emit);

      const { user } = useUser(userName, UserIdentifierType.UserName);
      const { lists, listUser, status } = useUserLists(user);

      return { user, lists, listUser, userName, status, ApiStatus };
    }
  });
</script>

<template>
  <div class="user-lists">
		<div class="user-lists-title">
			<h2>User Lists of {{ listUser?.name }}</h2>

			<span v-if="listUser?.isCurrentUser">That's you!</span>
		</div>

    <img :src="listUser?.avatar" />

    <div class="lists" v-if="status === ApiStatus.Ok">
      <div class="list card-single" v-for="(list) in lists" :key="list.name">
        <span class="list-name">{{ list.name }}</span>

        <span class="list-stats">
          <ListStats :list="list" />
        </span>

        <span class="list-link">
          <router-link :to="`/${list.id}`">Go to List</router-link>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  @use "sass:map";
  @import "$$component-utils";

  $itemCount: (default: 3, mobile: 1, tablet: 2);

  .lists
  {
    display: flex;
    flex-wrap: wrap;

    .list
    {
      display: grid;

      grid-template:
        [row1-start] "name  link" [row1-end]
        [row2-start] "stats stats" [row2-end]
                    / 75%   25%;

      @extend %card;

      text-align: start;

      margin: 1rem;
      width: calc(100% / #{map.get($itemCount, default)} - 2 * 1rem - 2 * #{$card-padding});

      @include respond(mobile) {
        width: calc(100% / #{map.get($itemCount, mobile)} - 2 * 1rem - 2 * #{$card-padding});
      }

      @include respond(tablet) {
        width: calc(100% / #{map.get($itemCount, tablet)} - 2 * 1rem - 2 * #{$card-padding});
      }


      //@include respond(mobile) {
      //  width: 100%;
      //}
      //
      //@include respond(tablet) {
      //  width: calc(50% - 1rem);
      //}

      .list-name
      {
        grid-area: name;
        font-size: 1.25rem;
      }

      .list-stats
      {
        grid-area: stats;
      }

      .list-link
      {
        grid-area: link;
      }
    }
  }

</style>
