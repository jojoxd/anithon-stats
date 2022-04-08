import {useLocalStorage} from "@vueuse/core";
import { readonly, Ref } from "vue";

const LANGUAGE_SWITCHER_LANGUAGE_LOCALSTORAGE_KEY = "language_switcher.language";

export enum Language
{
    English,
    Romaji,
    Native
}

const language = useLocalStorage<Language>(LANGUAGE_SWITCHER_LANGUAGE_LOCALSTORAGE_KEY, Language.Romaji);

export function useLanguageSwitcher()
{
    function setLanguage(lang: Language)
    {
        language.value = lang;
    }

    return {
        setLanguage,

        language: readonly(language),
    };
}

interface IUseLanguageSwitcherReturnData
{
    setLanguage(lang: Language): void;

    language: Readonly<Ref<Language>>;
}