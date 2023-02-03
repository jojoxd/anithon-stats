<script lang="ts">
    import {defineComponent, toRefs, PropType} from "vue";
    import {EntryId} from "@anistats/shared";
    import {mdiDelete, mdiDragVertical} from "@mdi/js";
    import {useEntry} from "../../lib/composition/entry/use-entry.fn";
    import { HandleDirective } from "vue-slicksort";

    export default defineComponent({
        directives: {
            HandleDirective,
        },

        props: {
            entryId: {
                type: String as PropType<EntryId>,
                required: true,
            },

            withHandle: {
                type: Boolean,
                default: false,
            },
        },

        emits: [
            'click:remove',
            'click:up',
            'click:down',
        ],

        setup(props, { emit, }) {
            const {
                entryId,
                withHandle,
            } = toRefs(props);

            const {
                entry,
                entryTitle,
                sequels,
            } = useEntry(entryId);

            return {
                entry,
                entryTitle,

                sequels,

                withHandle,
                mdiDragVertical,

                mdiDelete,
                onDelete: () => emit('click:delete'),
            };
        },
    });
</script>

<template>
    <v-layout>
        <v-container fluid class="px-0">
            <v-card>
                <v-card-text>
                    <v-system-bar class="ma-0">
                        <v-icon
                            v-if="withHandle"
                            v-handle-directive
                            :icon="mdiDragVertical"
                            class="handle"
                        ></v-icon
>

                        <span>{{ entryTitle }}</span>

                        <v-spacer />

                        <v-icon
                            class="remove-entry-btn"
                            :icon="mdiDelete"
                            @click.prevent="onDelete"
                        ></v-icon>
                    </v-system-bar>
                    <v-main>
                        <entry-info
                            :entry-id="entry.id"
                        ></entry-info>

                        <template v-for="sequel in sequels">
                            <v-divider />

                            <entry-info
                                :entry-id="sequel.id"
                                sequel
                            ></entry-info>
                        </template>
                    </v-main>
                </v-card-text>
            </v-card>
        </v-container>
    </v-layout>
</template>

<style scoped lang="scss">
    .remove-entry-btn {
        &:hover {
            animation: remove-btn 0.25s;
            color: red;
        }
    }

    .handle {
        cursor: ns-resize;
    }

    @keyframes remove-btn {
        0% {
            color: inherit;
        }

        100% {
            color: red;
        }
    }
</style>
