<script lang="ts">
    import { mdiMagnify } from "@mdi/js";
    import {computed, defineComponent, PropType, ref, toRefs, watch} from "vue";
    import {SeriesDto, SeriesId} from "@anistats/shared";
    import {breakpointsVuetify, useBreakpoints} from "@vueuse/core";
    import {useSearchSeries} from "../../../old/composition/useSearchSeries";

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
                default: false,
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
                foundSeries,
                resetData,
                searchStatus,
            } = useSearchSeries(query);

            watch(foundSeries, () => {
                console.log(foundSeries.value);
                selected.value = []; // reset selected
            });

            function onCompleted()
            {
                const selectedSeries = foundSeries.value?.filter((series) => {
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
                resetData();
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

            const isLoading = computed(() => {
                return searchStatus.value !== ApiStatus.Ok && searchStatus.value !== ApiStatus.Initial;
            });

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

                foundSeries,

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

                <v-list v-if="foundSeries">
                    <slot
                        name="item"
                        v-for="series in foundSeries"
                        :key="series.id"
                        :series="series"
                    >
                        <search-series-entry
                            :series="series"
                            :disabled="isDisabled(series)"
                            @click="toggleSelected(series)"
                            :selected="selected.includes(series.id)"
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
