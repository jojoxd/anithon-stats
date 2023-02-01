<script lang="ts">
    import {EntryId} from "@anistats/shared";
    import {defineComponent, PropType, toRefs} from "vue";
    import {get} from "@vueuse/core";
    import {mdiApplicationCogOutline, mdiChevronDown, mdiChevronUp} from "@mdi/js";
    import {useListStore} from "../../lib/store/list-store";
    import {useEntry} from "../../lib/composition/entry/use-entry.fn";
    import {useSeries} from "../../lib/composition/series/use-series.fn";

    export default defineComponent({
        props: {
            entryId: {
                type: String as PropType<EntryId>,
                required: true,
            },

            sequel: {
                type: Boolean,
                default: false,
            },
        },

        emits: [],

        setup(props, { emit, }) {
            const {
                entryId,
                sequel: isSequel,
            } = toRefs(props);

            const {
                setCurrentEntry,
            } = useListStore();

            const {
                entry,
                seriesId,
            } = useEntry(entryId);

            const {
                series,
                coverImage,
                seriesTitle,
            } = useSeries(seriesId);

            function onClickSettings()
            {
                setCurrentEntry(get(entryId));
            }

            return {
                entry,
                entryId,

                index: 0,

                seriesTitle,

                isSequel,

                coverImage,

                mdiChevronUp,
                onClickUp: () => emit('click:up'),

                mdiChevronDown,
                onClickDown: () => emit('click:down'),

                mdiApplicationCogOutline,
                onClickSettings,
            };
        },
    });
</script>

<template>
    <v-container class="mx-0">
        <v-row class="w-100">
            <v-col cols="1" class="entry-controls" v-if="!isSequel">
                <v-icon :icon="mdiChevronUp" @click.prevent="onClickUp" />
                <span>{{ index }}</span>
                <v-icon :icon="mdiChevronDown" @click.prevent="onClickDown" />
            </v-col>

            <v-col cols="1">
                <v-img :src="coverImage" :aspect-ratio="9 / 13"></v-img>
            </v-col>

            <v-col cols="10">
                <v-container>
                    <v-row>
                        <v-col class="text-h6">
                            {{ seriesTitle }}

                            <debug :items="{ entryId, sequel,  }"></debug>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>Series Description etc.</v-col>

                        <v-col>
                            <v-icon
                                :icon="mdiApplicationCogOutline"
                                @click.prevent="onClickSettings"
                            ></v-icon>
                        </v-col>
                    </v-row>
                </v-container>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped lang="scss">
    // @TODO: This display needs to be fully flex+grid custom built.
    .entry-controls {
        max-width: fit-content;

        display: flex;
        flex-direction: column;
        align-content: center;

        & > * {
            text-align: center;
        }
    }
</style>
