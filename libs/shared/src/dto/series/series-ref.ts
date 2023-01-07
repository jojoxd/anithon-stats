declare const SeriesIdSymbol: unique symbol;

export type SeriesId = number & { [SeriesIdSymbol]: never; };

export interface SeriesRef
{
    ref: SeriesId;
}
