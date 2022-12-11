<script lang="ts">
	import {defineComponent, toRefs, useAttrs} from "vue";
	import {useUser} from "../../../../composition/useUser";
	import {UserIdentifierType} from "@anistats/shared";

	export default defineComponent({
		inheritAttrs: false,

		props: {
			userId: {
				type: String,
				required: true,
			},
		},

		setup(props) {
			const {
				userId
			} = toRefs(props);

			const cardAttributes = useAttrs();

			const { user } = useUser(userId, UserIdentifierType.Uuid);

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
			Total Lists: {{ user.stats?.totalLists ?? "None" }}
			TODO: Add Stats to API
		</v-card-text>
	</v-card>
</template>
