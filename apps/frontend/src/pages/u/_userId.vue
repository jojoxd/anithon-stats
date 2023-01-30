<script lang="ts">
import {defineComponent, PropType, computed, toRefs} from "vue";
    import {UserId, UserResponse} from "@anistats/shared";
    import {wrapAxios} from "../../lib/composition/use-axios.fn";

    export default defineComponent({
        props: {
            userId: {
                type: String as unknown as PropType<UserId>,
                required: true,
            },
        },

        setup(props) {
            const {
                userId,
            } = toRefs(props);

            const {
                value: userResponse,
            } = wrapAxios((axios) => {
                return axios.get<void, UserResponse>(`user/${userId.value}`);
            });

            const user = computed(() => {
                return userResponse.value?.user ?? null;
            })

            return {
                user,
            };
        },
    });
</script>

<template>
    <UserLists v-if="user" :user="user" />
</template>
