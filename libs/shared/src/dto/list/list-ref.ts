declare const ListIdSymbol: unique symbol;

export type ListId = string & { [ListIdSymbol]: never; };

export interface ListRef
{
    id: ListId;
}
