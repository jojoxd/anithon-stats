declare const AnilistSeriesIdSymbol: unique symbol;

/**
 * @deprecated use AnilistMediaId instead
 */
export type AnilistSeriesId = number & { [AnilistSeriesIdSymbol]: never; };
