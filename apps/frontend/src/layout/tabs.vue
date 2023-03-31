<script lang="ts">
	import {useRoute} from "vue-router";
	import {defineComponent, ref} from "vue";

	export default defineComponent({
		setup() {
			const route = useRoute();
			const currentTab = ref();

			console.log(route);

			return {
				route,

				currentTab,
			};
		},
	});
</script>

<template>
	TABS

	<v-tabs v-model="currentTab">
		<template v-for="tab of route.meta.tabs" :key="tab.name">
			<v-tab :value="tab.name">{{ tab.name }}</v-tab>
		</template>
	</v-tabs>

	<v-window v-model="currentTab">
		<template v-for="tab of route.meta.tabs">
			<v-window-item :value="tab.name">
				{{ tab.component }}
			</v-window-item>
		</template>
	</v-window>
</template>
