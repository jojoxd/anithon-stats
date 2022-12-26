<script lang="ts">
	import {defineComponent, PropType} from "vue";
	import {IListData} from "@anistats/shared";
	import {useVModels} from "@vueuse/core";

	export default defineComponent({
		props: {
			list: {
				type: Object as PropType<IListData["lists"][0]>,
				required: true,
			},
		},

		setup(props, {emit}) {
			const {list} = useVModels(props, emit);

			return {
				list,
			};
		}
	});
</script>

<template>
	<v-chip-group disabled>
		<v-chip>{{ $moment.duration(list?.meta.totalDuration, 'minutes').format('HH:mm:ss') }}</v-chip>
	</v-chip-group>
</template>

<style scoped lang="scss">

</style>
