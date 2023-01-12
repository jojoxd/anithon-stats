<script lang="ts">
	import {computed, defineComponent, PropType, toRefs, useAttrs} from "vue";
  import {ListMetadataDto} from "@anistats/shared";

	export default defineComponent({
		inheritAttrs: false,

		props: {
		  listId: {
		    type: String,
        required: true,
      },

			metadata: {
				type: Object as PropType<ListMetadataDto>,
				required: true,
			},
		},

		setup(props) {
			const {
				listId,
        metadata,
			} = toRefs(props);

			const cardAttributes = useAttrs();

			const listUri = computed(() => {
			  return `/l/${listId.value}`;
      });

			return {
				listId,
				listUri,

				metadata,

				cardAttributes,
			};
		},
	});
</script>

<template>
	<v-card
		v-if="metadata"
		:title="metadata.title"
		v-bind="cardAttributes"
	>
		<v-card-text>
      <v-chip-group disabled>
        <v-chip>{{ $moment.duration(metadata.stats.time, 'minutes').format('HH:mm:ss') }}</v-chip>
      </v-chip-group>

			{{ metadata.description }}
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
