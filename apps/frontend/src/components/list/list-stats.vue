<script lang="ts">
    import {defineComponent, PropType, toRefs} from "vue";
    import {ListMetadataDto} from "@anistats/shared";

    export default defineComponent({
        props: {
            listMetadata: {
                type: Object as PropType<ListMetadataDto>,
                required: true,
            },
        },

        setup(props) {
            const {
                listMetadata,
            } = toRefs(props);

            return {
                listMetadata,
            };
        },
    });
</script>

<template>
    <v-chip-group disabled>
        <v-chip>{{ $moment.duration(listMetadata.time, 'minutes').format('HH:mm:ss') }}</v-chip>
    </v-chip-group>
</template>
