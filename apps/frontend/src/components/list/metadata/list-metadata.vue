<script lang="ts">
    import {defineComponent, PropType, toRefs} from "vue";
    import {ListMetadataDto} from "@anistats/shared";
    import {formatTime} from "../../../lib/filter/format-time.filter";

    export default defineComponent({
        props: {
            metadata: {
                type: Object as PropType<ListMetadataDto>,
                required: true,
            },
        },

        setup(props) {
            const {
                metadata,
            } = toRefs(props);

            return {
                metadata,

                formatTime,
            };
        },
    });
</script>

<template>
    <v-chip-group disabled>
        <v-chip>{{ formatTime({ minutes: metadata.stats.time, }) }}</v-chip>
    </v-chip-group>
</template>
