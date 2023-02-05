import {defineStore} from "pinia";
import { computed } from "vue";
import {wrapAxios} from "../composition/use-axios.fn";
import {UserResponse} from "@anistats/shared";

export const useAuthStore = defineStore('auth', () => {
    const {
        reload: reloadCurrentUser,
        value: userResponse,
    } = wrapAxios<UserResponse>(async (axios) => {
        return axios.get('user');
    });

    return {
        currentUser: computed(() => {
            return userResponse.value?.user ?? null;
        }),

        reloadCurrentUser,
    };
});
