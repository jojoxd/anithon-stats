<script lang="ts">
  import { defineComponent, PropType } from "vue";
  import {IAnilistUserMetadata, IEntry} from "@anistats/shared";
  import {useVModels} from "@vueuse/core";
  import {useEntry} from "../../composition/useEntry";

  export default defineComponent({
    props: {
      entry: {
        type: Object as PropType<IEntry>,
        required: true,
      },

      index: {
        type: Number,
        required: true,
      },

      user: {
        type: Object as PropType<IAnilistUserMetadata>,
        required: true,
      },

      upEnabled: {
        type: Boolean,
        required: false,
        default: true,
      },

      downEnabled: {
        type: Boolean,
        required: false,
        default: true,
      },
    },

		emits: [
			'move-up',
			'move-down',
		],

    setup(props, { emit })
    {
      const { entry, index, user, upEnabled, downEnabled } = useVModels(props, emit);

      const { sequels } = useEntry(entry);

      return {
        entry,
        index,
        user,
        sequels,

        upEnabled,
        downEnabled,

				moveUp: () => upEnabled.value && emit('move-up'),
				moveDown: () => downEnabled.value && emit('move-down'),
      };
    }
  })

</script>

<template>
	<entry-sheet
		:index="index"
		@move-up="moveUp"
		:up-enabled="upEnabled"
		@move-down="moveDown"
		:down-enabled="downEnabled"
		:entry="entry"
	>
		<div class="d-flex flex-column flex-grow-1">
			<Entry :entry="entry" :index="index" :user="user" />

			<template v-for="sequel of sequels">
				<Entry :entry="sequel" :user="user" />
			</template>
		</div>
	</entry-sheet>
</template>

<style scoped lang="scss">

</style>
