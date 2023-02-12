import {ChunkDto, EntryDto, ListDto, ListMetadataDto, ListSettingsDto} from "@anistats/shared";
import {ComputedRef, Ref} from "vue";
import {computedExtract} from "../../util/computed-extract.fn";
import {ListSettingsHydrator} from "../../hydrator/defaults/list-settings.hydrator";

export interface UseListExtractors
{
    metadata: ComputedRef<ListMetadataDto | null>;

    entries: ComputedRef<Array<EntryDto> | null>;

    listSettings: ComputedRef<ListSettingsDto | null>;

    chunks: ComputedRef<Array<ChunkDto> | null>;
}

export function useListExtractors(currentList: Ref<ListDto | null>): UseListExtractors
{
    const metadata = computedExtract(currentList, (_currentList) => {
        return _currentList?.metadata ?? null;
    });

    const entries = computedExtract(currentList, (_currentList) => {
        return _currentList?.entries.items ?? null;
    });

    const listSettings = computedExtract(currentList, (_currentList) => {
        return _currentList ? ListSettingsHydrator.hydrate(_currentList.settings) : null;
    });

    const chunks = computedExtract(currentList, (_currentList) => {
        return _currentList?.chunks.items ?? null;
    })

    return {
        metadata,

        entries,

        listSettings,

        chunks,
    };
}