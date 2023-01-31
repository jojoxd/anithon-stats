<script lang="ts">
    import {computed, defineComponent, PropType, toRefs} from "vue";
    import {get} from "@vueuse/core";
    import {UserId, UserListsResponse} from "@anistats/shared";
    import {wrapAxios} from "../../../lib/composition/use-axios.fn";

    export default defineComponent({
        props: {
            userId: {
                type: String as PropType<UserId>,
                required: true,
            },
        },

        setup(props) {
            const {
                userId,
            } = toRefs(props);

            const {
                value: userListsResponse,
                isLoading,
            } = wrapAxios<UserListsResponse>((axios) => {
                const _userId = get(userId);
                return axios.get(`user/${_userId}/lists`);
            });

            const lists = computed(() => {
                const _userListsResponse = get(userListsResponse);
                return _userListsResponse?.lists ?? null;
            });

            const user = computed(() => {
                const _userListsResponse = get(userListsResponse);
                return _userListsResponse?.user ?? null;
            });

            return {
                user,
                lists,

                isLoading,
            };
        },
    });
</script>

<template>
	<v-container fluid>
        <v-row v-if="isLoading">
            Loading (TODO: Skeleton Loader should go here)
        </v-row>

		<v-row v-if="!isLoading && user && lists">
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
