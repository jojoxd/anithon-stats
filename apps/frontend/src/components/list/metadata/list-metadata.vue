<script lang="ts">
    import {defineComponent, PropType, toRefs} from "vue";
    import {ListMetadataDto} from "@anistats/shared";

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
            };
        },
    });
</script>

<template>
    <v-chip-group disabled>
        <v-chip>{{ $moment.duration(metadata.time, 'minutes').format('HH:mm:ss') }}</v-chip>
    </v-chip-group>
</template>
