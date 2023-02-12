import {EntryId, ListDto, SeriesDto} from "@anistats/shared";
import {get} from "@vueuse/core";
import { Ref } from "vue";
import { EntryDataDtoFactory } from "../../factory/entry/entry-data-dto.factory";
import { EntryDtoFactory } from "../../factory/entry/entry-dto.factory";
import {useListGetters} from "./use-list-getters";

export interface UseListCrud
{
    addEntryBySeries(seriesDto: SeriesDto): void;

    removeEntry(entryId: EntryId): void;
}

export function useListCrud(currentList: Ref<ListDto | null>): UseListCrud
{
    let newIndex = -1;

    const {
        getEntry,
        getEntryData,
    } = useListGetters(currentList);

    function addEntryBySeries(seriesDto: SeriesDto): void
    {
        const _currentList = get(currentList);

        if (!_currentList) {
            return;
        }

        const newEntryId = `${newIndex--}` as unknown as EntryId;

        const entryDto = EntryDtoFactory.createFromSeriesDto(newEntryId, seriesDto);
        const entryDataDto = EntryDataDtoFactory.create(newEntryId);

        // @TODO: Set as sequel if needed
        console.log({ seriesDto, entryDto, });

        const prequelSeries = _currentList.series.items.find((currentSeries) => {
            return currentSeries.sequelIds.includes(seriesDto.id);
        });

        if (prequelSeries) {
            // get prequel entry
            const prequelEntry = _currentList.entries.items.find(entry => entry.series.ref === prequelSeries.id);

            if (prequelEntry) {
                const prequelEntryData = getEntryData(prequelEntry.id);

                if (prequelEntryData?.splitSequelEntry === false) {
                    console.log('Set sequel of %s to %s', prequelEntry.id, newEntryId);
                    prequelEntry.sequel ??= {
                        ref: newEntryId,
                    };
                }
            }
        }

        const sequelSeries = _currentList.series.items.find((currentSeries) => {
            return currentSeries.prequelIds.includes(seriesDto.id);
        });

        if (sequelSeries) {
            const sequelEntry = _currentList.entries.items.find(entry => entry.series.ref === sequelSeries.id);

            if (sequelEntry) {
                console.log('Set sequel of %s to %s', newEntryId, sequelEntry.id);
                entryDto.sequel = {
                    ref: sequelEntry.id,
                };
            }
        }

        _currentList.series.items.push(seriesDto);
        _currentList.entries.data.push(entryDataDto);
        _currentList.entries.items.push(entryDto);
    }

    function removeEntry(entryId: EntryId): void
    {
        console.log('remove entry', entryId);

        const _currentList = get(currentList);
        const removedEntry = getEntry(entryId)!;

        if (!_currentList || !removedEntry) {
            console.log('could not find currentList or removedEntry', { _currentList, removedEntry, });
            return;
        }

        console.log('Removing entry, data and series', entryId);

        _currentList.entries.items = _currentList.entries.items.filter(entry => entry.id !== removedEntry.id);
        _currentList.entries.data = _currentList.entries.data.filter(entryData => entryData.ref !== removedEntry.id);
        _currentList.series.items = _currentList.series.items.filter(series => series.id !== removedEntry.series.ref);
    }


    return {
        addEntryBySeries,
        removeEntry,
    };
}