<script lang="ts">
    import {computed, defineComponent, PropType, toRefs} from "vue";
    import {SeriesDto} from "@anistats/shared";
    import {useSeriesTitle} from "../../../lib/composition/series/use-series-title.fn";

    export default defineComponent({
        props: {
            series: {
                type: Object as PropType<SeriesDto>,
                required: true,
            },

            selected: {
                type: Boolean,
                default: false,
            },

            disabled: {
                type: Boolean,
                default: false,
            },
        },

        emits: [
            'click',
        ],

        setup(props, { emit })
        {
            const {
                series,
                selected,
                disabled,
            } = toRefs(props);

            const {
                seriesTitle: title,
            } = useSeriesTitle(computed(() => {
                return series.value.title;
            }));

            function onClick()
            {
                if (!disabled.value) {
                    emit('click');
                }
            }

            return {
                disabled,
                series,
                onClick,
                title,
                selected,
            };
        },
    });
</script>

<template>
    <v-list-item
        :class="{ disabled, 'search-series-item': true, }"
        @click="onClick"
        :active="selected"
        :prepend-avatar="series.coverImage"
    >
        <v-list-item-title class="search-series-item-title">{{ title }}</v-list-item-title>

        <v-chip-group disabled>
            <v-chip>{{ series.episodes }} episodes</v-chip>
            <v-chip>{{ $moment.duration(series.duration, 'minutes').format('HH:mm:ss') }} / episode</v-chip>

            <v-chip>Test 123</v-chip>
        </v-chip-group>
    </v-list-item>
</template>

<style lang="scss" scoped>
    .search-series-item {
        &.disabled {
            .search-series-item-title {
                text-decoration: line-through;
            }
        }
    }
</style>