<script lang="ts">
	import {defineComponent} from "vue";
	import {storeToRefs} from "pinia";
	import {Theme, useAppStore} from "../../../composition/store/app-store";

	const Themes: Record<Theme, string> = {
		[Theme.Light]: 'Light',
		[Theme.Dark]: 'Dark',
		[Theme.AnilistLike]: 'Like Anilist',
	};

	export default defineComponent({
		setup() {
			const {
				theme
			} = storeToRefs(useAppStore());

			return {
				theme,
				themes: Object.keys(Themes),

				mapThemeName: (themeName: string) => {
					return themeName in Themes ? Themes[themeName] : themeName;
				}
			};
		},
	});
</script>

<template>
	<v-select
		label="Theme"
		variant="underlined"
		v-model="theme"
		:items="themes"
		:item-title="mapThemeName"
		:item-value="(item) => item"
	></v-select>
</template>
