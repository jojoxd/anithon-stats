declare const AnilistSeriesIdSymbol: unique symbol;

// We don't assume types of external entity id's
export type AnilistSeriesId = any & { [AnilistSeriesIdSymbol]: never; };
