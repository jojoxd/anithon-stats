<script lang="ts">
	import {computed, defineComponent, PropType, ref} from "vue";
	import {useVModels} from "@vueuse/core";
  import {ApiStatus, useApi} from "../../composition/useApi";
  import {UserDto, UserListsResponse} from "@anistats/shared";

	export default defineComponent({
    props: {
      user: {
        type: Object as PropType<UserDto>,
        required: true,
      },
    },

    setup(props, { emit }) {
      const { user } = useVModels(props, emit);

      const apiUri = computed(() => {
        return `user/${user.value.id}/lists`;
      })

      const {
        status,
        data
      } = useApi<void, UserListsResponse>(apiUri, ref(), true, 'GET');

      const lists = computed(() => {
        return data.value?.lists;
      });

      const userData = computed(() => {
        return data.value?.user;
      })

      return {
        user,
        data,

        lists,
        userData,

        status,
        ApiStatus
      };
    }
  });
</script>

<template>
	<v-container fluid>
		<v-row>
			<v-col cols="12">
				<user-preview-card :user="user" />
			</v-col>

			<v-col
				v-for="(metadata, listId) of lists"
				:key="listId"
				cols="12"
				md="4"
				lg="3"
			>
				<list-preview-card :list-id="listId" :metadata="metadata" />
			</v-col>
		</v-row>
	</v-container>
</template>
