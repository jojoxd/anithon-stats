<script lang="ts">
    import {defineComponent, PropType, toRefs} from "vue";
    import {SeriesDto} from "@anistats/shared";
    import {formatTime} from "../../../../lib/filter/format-time.filter";

    export default defineComponent({
        props: {
            series: {
                type: Object as PropType<SeriesDto>,
                required: true,
            },
        },

        setup(props) {
            const {
                series
            } = toRefs(props);

            return {
                series,

                formatTime,
            };
        },
    });
</script>

<template>
    <v-chip-group disabled>
        <v-chip>{{ series.episodes }} episodes</v-chip>
        <v-chip>{{ formatTime({ minute: series.duration }) }} / episode</v-chip>
        <v-chip>{{ formatTime({ minute: series.episodes * series.duration }) }} total</v-chip>

        <v-chip>Test 123</v-chip>
    </v-chip-group>
</template>