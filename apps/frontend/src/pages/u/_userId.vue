<script lang="ts">
    import {defineComponent, PropType, toRefs} from "vue";
    import {UserId} from "@anistats/shared";

    export default defineComponent({
        props: {
            userId: {
                type: String as unknown as PropType<UserId>,
                required: true,
            },
        },

        setup(props) {
            const {
                userId,
            } = toRefs(props);

            return {
                userId,
            };
        },
    });
</script>

<template>
    <list-overview :user-id="userId" />
</template>
