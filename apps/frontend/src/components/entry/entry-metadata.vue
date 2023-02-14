<script lang="ts">
import {computed, defineComponent, PropType, toRefs} from "vue";
    import {computedExtract} from "../../lib/util/computed-extract.fn";
    import {EntryId} from "@anistats/shared";
    import {formatTime} from "../../lib/filter/format-time.filter";
    import {useDynamicListStore} from "../../lib/composition/store/list/use-dynamic-list-store.fn";
import {get} from "@vueuse/core";
import {useEntryMetadata} from "../../lib/composition/entry/use-entry-metadata.fn";

    export default defineComponent({
        props: {
            entryId: {
                type: Object as PropType<EntryId>,
                required: true,
            },
        },

        setup(props) {
            const {
                entryId,
            } = toRefs(props);

            const {
                fetchEntry,
                fetchEntryData,
                fetchSeries,
            } = useDynamicListStore();

            const entry = fetchEntry(entryId);
            const entryData = fetchEntryData(entryId);

            const seriesId = computedExtract(entry, (entry) => entry?.series.ref);
            const series = fetchSeries(seriesId);

            const {
                totalEpisodes,
                episodeDuration,
                totalDuration,
            } = useEntryMetadata(entryId);

            return {
                entry,
                entryData,
                series,

                totalEpisodes,
                episodeDuration,
                totalDuration,

                formatTime,
            };
        },
    });
</script>

<template>
    <v-chip-group disabled v-if="series && entryData">
        <v-chip>{{ totalEpisodes }} episodes</v-chip>
        <v-chip>{{ formatTime({ minute: episodeDuration, }) }} / episode</v-chip>
        <v-chip>{{ formatTime({ minute: totalDuration, }) }} total</v-chip>
    </v-chip-group>
</template>