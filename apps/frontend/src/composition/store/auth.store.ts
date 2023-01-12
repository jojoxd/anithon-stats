import {defineStore} from "pinia";
import { computed, ref } from "vue";
import {useApi} from "../useApi";
import {UserResponse} from "@anistats/shared";

export const useAuthStore = defineStore('auth', () => {
    const {
        data: userResponse,
        reload: reloadCurrentUser,
    } = useApi<void, UserResponse>(
        'user',
        ref(),
        true,
        'GET'
    );

    return {
        currentUser: computed(() => {
            return userResponse.value?.user ?? null;
        }),

        reloadCurrentUser,
    };
});
