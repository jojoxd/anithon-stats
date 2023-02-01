<script lang="ts">
    import {computed, defineComponent} from "vue";
    import {mdiHome, mdiLoginVariant} from "@mdi/js";
    import {storeToRefs} from "pinia";
    import {useAuthStore} from "../../../lib/store/auth.store";

    export default defineComponent({
        setup() {
            const authStore = useAuthStore();

            const {
                currentUser,
            } = storeToRefs(authStore);

            authStore.reloadCurrentUser();

            const oauthUri = computed(() => {
                return `/api/auth/login?redirect=${encodeURIComponent(window.location.href)}`;
            });

            return {
                currentUser,

                oauthUri,

                mdiHome,
                mdiLoginVariant,
            };
        },
    });
</script>

<template>
    <v-app-bar app>
        <v-app-bar-title class="app-title">
            <span>
                AniStats
                <span class="font-italic">V3</span>
            </span>

            <firefly-background :scale="0.3" :style="{ width: '3ch', height: '60%', top: '20%', 'left': '8ch', opacity: 0.2, }" />
        </v-app-bar-title>



        <search-global></search-global>

        <v-btn
            to="/"
            variant="plain"
            :prepend-icon="mdiHome"
        >
            Home
        </v-btn>



        <div v-if="currentUser">
            <user-settings-menu>
                <template #activator="{ props }">
                    <v-btn
                        icon
                        variant="plain"
                        v-bind="props"
                    >
                        <v-avatar
                            :image="currentUser.avatar"
                        ></v-avatar>
                    </v-btn>
                </template>
            </user-settings-menu>
        </div>
        <div v-else>
            <v-btn
                :prepend-icon="mdiLoginVariant"
                :href="oauthUri"
                variant="plain"
            >
                Log in
            </v-btn>
        </div>
    </v-app-bar>
</template>
