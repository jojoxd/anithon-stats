<script lang="ts">
    import {defineComponent, PropType, ref, toRefs} from "vue";
    import {storeToRefs} from "pinia";
    import {useAppStore} from "../../lib/store/app-store";
    import {mdiBug} from "@mdi/js";

    export default defineComponent({
        props: {
            items: {
                type: Object as PropType<Record<string, any>>,
                required: false,
                default: () => {
                    return {};
                },
            }
        },

        setup(props) {
            const {
                items
            } = toRefs(props);

            const {
                isDebugEnabled,
            } = storeToRefs(useAppStore());

            const showMenu = ref(false);

            return {
                items,
                isDebugEnabled,
                showMenu,

                mdiBug,
            };
        },
    });
</script>

<template>
    <v-menu v-model="showMenu" v-if="isDebugEnabled" :close-on-content-click="false" open-on-hover open-delay="0">
        <template #activator="{ props }">
            <v-icon
                color="indigo"
                :icon="mdiBug"
                v-bind="props"
            ></v-icon>
        </template>

        <slot name="default">
            <v-card>
                <v-list>
                    <v-list-item
                        v-for="(value, title) of items"
                        :key="title"
                        :title="title"
                    >
                        {{ value }}
                    </v-list-item>
                </v-list>
            </v-card>
        </slot>
    </v-menu>
</template>