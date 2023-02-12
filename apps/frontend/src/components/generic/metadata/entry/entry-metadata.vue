<script lang="ts">
    import {defineComponent, PropType, toRefs} from "vue";
    import {computedExtract} from "../../../../lib/util/computed-extract.fn";
    import {useSeries} from "../../../../lib/composition/series/use-series.fn";
    import {EntryDto} from "@anistats/shared";

    export default defineComponent({
        props: {
            entry: {
                type: Object as PropType<EntryDto>,
                required: true,
            },
        },

        setup(props) {
            const {
                entry,
            } = toRefs(props);

            const seriesId = computedExtract(entry, (entry) => entry.series.ref);

            const {
                series,
            } = useSeries(seriesId);

            return {
                entry,
                series,
            };
        },
    });
</script>

<template>
    <v-chip-group>

    </v-chip-group>
</template>