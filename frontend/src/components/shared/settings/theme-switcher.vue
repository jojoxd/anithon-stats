<script lang="ts">
	import {defineComponent, computed} from "vue";
	import {useTheme} from "vuetify";

	export default defineComponent({
		setup() {
			const vuetifyTheme = useTheme();

			return {
				theme: vuetifyTheme.global.name,
				themes: computed(() => {
					return Object.keys(vuetifyTheme.themes.value);
				}),

				mapThemeName: (themeName: string) => {
					const themeNameMap = {
						'dark': 'Dark',
						'light': 'Light',
						'anilist-like': 'Like AniList',
					};

					return themeName in themeNameMap ? themeNameMap[themeName] : themeName;
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
