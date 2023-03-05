<script lang="ts">
    import {defineComponent} from "vue";
    import {storeToRefs} from "pinia";
    import {useAppStore} from "./lib/store/app.store";

    export default defineComponent({
        setup() {
            const {
                theme,
            } = storeToRefs(useAppStore());

            return {
                theme,
            };
        },
    });
</script>

<template>
    <v-app :theme="theme">
        <overlay-provider>
            <page-header />

            <v-main>
                <v-container fluid>
					<router-view v-slot="{ Component, route }">
						<transition name="slide-x-transition">
							<component :is="Component" :key="route.path" />
						</transition>
					</router-view>
                </v-container>
            </v-main>
        </overlay-provider>
    </v-app>
</template>

<style scoped lang="scss">
</style>
