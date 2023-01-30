<script lang="ts">
    import { computed, defineComponent, PropType, toRefs } from "vue";
    import { get } from "@vueuse/core";
    import { UserDto, UserListsResponse } from "@anistats/shared";
    import { wrapAxios } from "../../lib/composition/use-axios.fn";

    export default defineComponent({
        props: {
            user: {
                type: Object as PropType<UserDto>,
                required: true,
            },
        },

        setup(props) {
            const {
                user,
            } = toRefs(props);

            const {
                value: userListsResponse,
            } = wrapAxios((axios) => {
                return axios.get<void, UserListsResponse>(`user/${get(user).id}/lists`);
            });

            const lists = computed(() => {
                return userListsResponse.value?.lists;
            });

            const userData = computed(() => {
                return userListsResponse.value?.user;
            });

            return {
                user,

                lists,
                userData,
            };
        },
    });
</script>

<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <user-preview-card
                    :user="user"
                ></user-preview-card>
            </v-col>

            <v-col
                v-for="(metadata, listId) of lists"
                :key="listId"
                cols="12"
                md="4"
                lg="3"
            >
                <list-preview-card
                    :list-id="listId"
                    :metadata="metadata"
                ></list-preview-card>
            </v-col>
        </v-row>
    </v-container>
</template>
