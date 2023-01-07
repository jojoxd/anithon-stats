declare const EntryIdSymbol: unique symbol;

export type EntryId = string & { [EntryIdSymbol]: never; };

export interface EntryRef
{
    ref: EntryId;
}
