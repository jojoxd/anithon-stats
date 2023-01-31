<script lang="ts">
    import {defineComponent, PropType, toRefs, useAttrs} from "vue";
    import {UserDto} from "@anistats/shared";

    export default defineComponent({
        inheritAttrs: false,

        props: {
            user: {
                type: Object as PropType<UserDto>,
                required: true,
            },
        },

        setup(props) {
            const {
                user,
            } = toRefs(props);

            const cardAttributes = useAttrs();

            return {
                user,

                cardAttributes,
            };
        },
    });
</script>

<template>
	<v-card
		v-if="user"
		:prepend-avatar="user.avatar"
		:title="user.name"
		v-bind="cardAttributes"
	>
		<v-card-text>
			Total Lists: TODO: Add Total List number somehow
			TODO: Add Stats to API
		</v-card-text>
	</v-card>
</template>
