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

            const showTooltip = ref(false);

            return {
                items,
                isDebugEnabled,
                showTooltip,

                mdiBug,
            };
        },
    });
</script>

<template>
    <v-tooltip v-model="showTooltip" v-if="isDebugEnabled" :close-on-content-click="false">
        <template #activator="{ props }">
            <v-icon
                color="indigo"
                :icon="mdiBug"
                v-bind="props"
            ></v-icon>
        </template>

        <slot name="default">
            <v-card min-width="75">
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
    </v-tooltip>
</template>