<script lang="ts">
import {defineComponent, PropType, computed, toRefs} from "vue";
    import {UserId, UserResponse} from "@anistats/shared";
    import {wrapAxios} from "../../lib/composition/use-axios.fn";

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
