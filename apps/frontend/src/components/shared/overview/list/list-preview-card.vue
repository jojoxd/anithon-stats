<script lang="ts">
	import {computed, defineComponent, ref, toRefs, useAttrs} from "vue";
	import {useUserList} from "../../../../composition/useUserList";
	import {UserIdentifierType} from "@anistats/shared";

	export default defineComponent({
		inheritAttrs: false,

		props: {
			// @TODO: Is userId really needed here? isn't the backend already using UUID's for lists?
			userId: {
				type: String,
				required: true,
			},

			listId: {
				type: String,
				required: true,
			},
		},

		setup(props) {
			const {
				userId,
				listId,
			} = toRefs(props);

			const cardAttributes = useAttrs();

			const { list } = useUserList(userId, listId, UserIdentifierType.Uuid);

			const listUri = computed(() => `/l/${listId.value}`);

			return {
				listId,
				listUri,

				list,

				cardAttributes,
			};
		},
	});
</script>

<template>
	<v-card
		v-if="list"
		:title="list.name"
		v-bind="cardAttributes"
	>
		<v-card-text>
			{{ list }}
		</v-card-text>

		<v-card-actions>
			<v-btn :to="listUri">
				View
			</v-btn>
		</v-card-actions>
	</v-card>
	<div v-else>
		Loading...
	</div>
</template>
