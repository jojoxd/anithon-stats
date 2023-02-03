import {EntryDataDto, EntryDto, EntryId, SeriesDto} from "@anistats/shared";
import {get, MaybeRef} from "@vueuse/core";
import {useListStore} from "../store/list-store";

export class EntryView
{
    constructor(
        protected readonly entry: MaybeRef<EntryDto>
    ) {}

    protected get listStore()
    {
        return useListStore();
    }

    get id(): EntryId
    {
        return get(this.entry).id;
    }

    get sequel(): EntryView | null
    {
        if (this.data.splitSequelEntry) {
            return null;
        }

        const sequelEntry = this.listStore.getSequelEntry(this.id);

        if (!sequelEntry) {
            return null;
        }

        return new EntryView(sequelEntry);
    }

    get data(): EntryDataDto
    {
        return this.listStore.getEntryData(this.id)!;
    }

    get series(): SeriesDto
    {
        const _entry = get(this.entry);

        return this.listStore.getSeries(_entry.series.ref)!;
    }

    get order(): number | null
    {
        return this.data.order;
    }
}