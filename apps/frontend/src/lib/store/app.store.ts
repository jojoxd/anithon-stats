import {defineStore} from "pinia";
import {StorageSerializers, useLocalStorage} from "@vueuse/core";
import { Theme } from "./types/theme.enum";
import { Language } from "./types/language.enum";
import { ref } from "vue";

export const useAppStore = defineStore('app', () => {
	const language = useLocalStorage<Language>("app.language", Language.Romaji);
	const isDebugEnabled = useLocalStorage<boolean>('app.debug', false, { serializer: StorageSerializers.boolean });
	const theme = useLocalStorage<Theme>('app.theme', Theme.AnilistLike);

	// @TODO: Save in backend on user: theme and language
    // @TODO: Pre-fill language to Viewer default language in backend

	const isLoading = ref(false);

	return {
		language,

		theme,

		isDebugEnabled,

		isLoading,
	};
});
