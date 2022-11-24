import {defineStore} from "pinia";
import {StorageSerializers, useLocalStorage} from "@vueuse/core";

export enum Language
{
	English,
	Romaji,
	Native
}

export enum Theme
{
	Dark = 'dark',
	Light = 'light',
	AnilistLike = 'anilist-like',
}

export const useAppStore = defineStore('app', () => {
	const language = useLocalStorage<Language>("app.language", Language.Romaji);
	const isDebugEnabled = useLocalStorage<boolean>('app.debug', false, { serializer: StorageSerializers.boolean });
	const theme = useLocalStorage<Theme>('app.theme', Theme.AnilistLike);

	return {
		language,

		theme,

		isDebugEnabled,
	};
});
