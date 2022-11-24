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
	<v-container fluid>
		<v-row>
			<v-col cols="12">
				<user-preview-card :user-id="listUser?.uuid" />
			</v-col>

			<v-col
				v-for="list of lists"
				:key="list.id"
				cols="12"
				md="4"
				lg="3"
			>
				<list-preview-card :user-id="listUser?.uuid" :list-id="list.id" />
			</v-col>
		</v-row>
	</v-container>
</template>
