<script lang="ts">
    import {computed, defineComponent, PropType, toRefs, useAttrs} from "vue";
    import {ListMetadataDto} from "@anistats/shared";
    import {get} from "@vueuse/core";

    export default defineComponent({
        inheritAttrs: false,

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

            const cardAttributes = useAttrs();

            const listUri = computed(() => {
                const _metadata = get(metadata);
                return `/l/${_metadata.ref.id}`;
            });

            return {
                metadata,
                listUri,

                cardAttributes,
            };
        },
    });
</script>

<template>
    <v-card
        :title="metadata.title"
        v-bind="cardAttributes"
    >
        <v-card-text>
            <list-metadata :metadata="metadata" />

            {{ metadata.description }}
        </v-card-text>

        <v-card-actions>
            <v-btn :to="listUri">
                View
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
