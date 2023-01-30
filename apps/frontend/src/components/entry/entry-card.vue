<script lang="ts">
    import {defineComponent, toRefs, PropType} from "vue";
    import {EntryId} from "@anistats/shared";
    import {mdiDelete, mdiDragVertical} from "@mdi/js";
    import {useEntry} from "../../lib/composition/entry/use-entry.fn";

    export default defineComponent({
        props: {
            entryId: {
                type: Object as PropType<EntryId>,
                required: true,
            },
        },

        emits: [
            'click:remove',
            'click:up',
            'click:down',
        ],

        setup(props) {
            const {
                entryId,
            } = toRefs(props);

            const {
                entryTitle,
                sequels,
            } = useEntry(entryId);

            return {
                entryTitle,

                sequels,

                mdiDragVertical,
                mdiDelete,
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
                            :icon="mdiDragVertical"
                        ></v-icon>

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
                            :entry="entry"
                        ></entry-info>

                        <template v-for="sequel in sequels">
                            <v-divider />

                            <entry-info
                                :entry="sequel"
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

    @keyframes remove-btn {
        0% {
            color: inherit;
        }

        100% {
            color: red;
        }
    }
</style>
