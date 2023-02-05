<script lang="ts">
    import { mdiMagnify } from "@mdi/js";
    import {defineComponent, PropType, ref, toRefs, watch} from "vue";
    import {SeriesDto, SeriesId} from "@anistats/shared";
    import {breakpointsVuetify, useBreakpoints} from "@vueuse/core";
    import {useSeriesSearch} from "../../../lib/composition/search/series/use-series-search.fn";

    export default defineComponent({
        props: {
            multiple: {
                type: Boolean,
                required: false,
                default: false,
            },

            isDisabled: {
                type: Function as PropType<(series: SeriesDto) => boolean>,
                required: false,
                default: () => false,
            },
        },

        emits: [
            'selected'
        ],

        setup(props, { emit }) {
            const query = ref();
            const selected = ref<Array<SeriesId>>([]);

            const isOpened = ref(false);

            const breakpoints = useBreakpoints(breakpointsVuetify);
            const isSmallScreen = breakpoints.smaller('md');

            const {
                multiple,
                isDisabled,
            } = toRefs(props);

            const {
                reload,
                reset: resetSearchData,
                isLoading,
                series,
            } = useSeriesSearch(query);

            watch(series, () => {
                console.log(series.value);
                selected.value = []; // reset selected
            });

            function onCompleted()
            {
                const selectedSeries = series.value?.filter((series) => {
                    return selected.value.includes(series.id);
                });

                emit('selected', selectedSeries);
                close();
            }

            function close()
            {
                isOpened.value = false;
                query.value = '';
                selected.value = [];
                resetSearchData();
            }

            function toggleSelected(series: SeriesDto): void
            {
                if (!multiple.value) {
                    selected.value = [series.id];
                    return;
                }

                if(selected.value.includes(series.id)) {
                    selected.value = selected.value.filter(seriesId => seriesId !== series.id);
                } else {
                    selected.value.push(series.id);
                }
            }

            return {
                query,

                onCompleted,
                close,

                selected,
                toggleSelected,

                isLoading,
                isOpened,

                isDisabled,

                multiple,

                isSmallScreen,

                series,

                mdiMagnify,
            };
        },
    });
</script>

<template>
    <v-dialog v-model="isOpened" :fullscreen="isSmallScreen">
        <template #activator="{ on, props }">
            <v-btn
                v-on="on"
                v-bind="props"
            >
                Add
            </v-btn>
        </template>

    <v-card
        density="compact"
        variant="elevated"
    >
        <v-card-title>Search Anime</v-card-title>

            <v-card-text>
                <v-text-field
                    ref="textField"
                    v-model="query"
                    :loading="isLoading"
                    variant="outlined"
                    hide-details
                    clearable
                    label="Search"
                    :prepend-inner-icon="mdiMagnify"
                ></v-text-field>

                <div v-if="multiple">
                    Hint: You can select multiple series at once!
                </div>

                <v-list v-if="series">
                    <slot
                        name="item"
                        v-for="s in series"
                        :key="s.id"
                        :series="s"
                    >
                        <search-series-entry
                            :series="s"
                            :disabled="isDisabled(s)"
                            @click="toggleSelected(s)"
                            :selected="selected.includes(s.id)"
                        ></search-series-entry>
                    </slot>
                </v-list>
        </v-card-text>

        <v-card-actions>
        <v-btn
        :disabled="selected.length === 0"
        @click="onCompleted"
        >Add</v-btn>

        <v-btn
        @click="close"
        >Close</v-btn>
        </v-card-actions>
    </v-card>
    </v-dialog>
</template>
