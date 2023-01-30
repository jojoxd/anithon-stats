<script lang="ts">
    import { defineComponent, PropType, toRefs } from "vue";
    import { SearchGlobalUserDto } from "@anistats/shared";

    export default defineComponent({
        props: {
            user: {
                type: Object as PropType<SearchGlobalUserDto>,
                required: true,
            }
        },

        emits: [
            'click',
        ],

        setup(props, { emit, }) {
            const {
                user,
            } = toRefs(props);

            return {
                user,

                onClick: () => emit('click')
            };
        },
    });
</script>

<template>
    <v-list-item
        @click="onClick"
        :title="user.name"
        :prepend-avatar="user.avatar"
    ></v-list-item>
</template>
