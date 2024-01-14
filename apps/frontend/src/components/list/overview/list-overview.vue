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
            }, {
				immediate: true,
				watch: [userId],
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
		<v-row>
			<v-col cols="12">
                <v-skeleton-loader
                    :loading="isLoading"
                    type="avatar, heading, text"
                >
                    <user-preview-card :user="user" />
                </v-skeleton-loader>
			</v-col>

            <v-col
                cols="12"
                md="4"
                lg="3"
                v-for="i in 6"
                v-if="isLoading"
            >
                <!-- @TODO(#32): Fix this skeleton loader when a fix for vuetify is merged -->
                <v-skeleton-loader
                    :loading="true"
                    max-height="550"
                    type="heading, chip@3, text, button"
                >Hello</v-skeleton-loader>
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
