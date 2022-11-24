import {MaybeRef, get} from "@vueuse/core";
import {computed, ComputedRef} from "vue";
import {IEntry} from "@anistats/shared";
import {Language, useLanguageSwitcher} from "./useLanguageSwitcher";

const FALLBACK_COVER = "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/default.jpg";

export function useEntry(entry: MaybeRef<IEntry>): IUseEntryReturnData
{
    // Title
    const { language } = useLanguageSwitcher();

    const title = computed(() => {
        const _entry = get(entry);

        if(language.value == Language.English && _entry?.series?.title?.english)
            return _entry.series.title.english;

        if(language.value == Language.Native && _entry?.series?.title?.native)
            return _entry.series.title.native;

        if(language.value == Language.Romaji && _entry?.series?.title?.romaji)
            return _entry.series.title.romaji;

        return _entry?.series?.title?.english ??
            _entry?.series?.title?.romaji ??
            _entry?.series?.title?.native ??
            "No Title Available";
    });


    // Cover
    const cover = computed<string>(() => {
        return get(entry)?.series?.coverImage ?? FALLBACK_COVER;
    });


    // Description
    const description = computed(() => {
        return get(entry)?.series?.description ?? "No Description Available.";
    });


    // Sequels
    const sequels = computed<Array<IEntry>>(() => {
        let _entry = get(entry);
        const _sequels = [];

        while(_entry && _entry.sequel) {
            _sequels.push(_entry.sequel);

            // @TODO: Add global debug switch
            console.log('[useEntry#sequels] %s => SEQ %s', _entry.series.title.romaji, _entry.sequel.series.title.romaji);

            _entry = _entry.sequel;
        }

        return _sequels;
    });


    // Duration
    const episodes = computed<number>(() => {
        const _entry = get(entry);

        if(_entry.series.episodes && _entry.savedData?.startAt) {
            return _entry.series.episodes! - _entry.savedData.startAt;
        }

        return _entry.series.episodes ?? 0;
    });

    const episodeDuration = computed<number>(() => {
        const _entry = get(entry);

        return _entry.series.duration! * (_entry.savedData?.mult ?? 1);
    });

    const totalDuration = computed<number>(() => {
        return episodes.value * episodeDuration.value;
    });

    return {
        title,

        cover,

        description,

        sequels,

        duration: {
            episodes,
            episodeDuration,
            totalDuration,
        },
    };
}

export interface IUseEntryReturnData
{
    title: ComputedRef<string>;

    cover: ComputedRef<string>;

    description: ComputedRef<string>;

    sequels: ComputedRef<ReadonlyArray<IEntry>>;

    duration: {
        episodes: ComputedRef<number>;
        episodeDuration: ComputedRef<number>;
        totalDuration: ComputedRef<number>;
    };
}
