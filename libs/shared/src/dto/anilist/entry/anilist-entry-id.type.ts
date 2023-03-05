declare const AnilistEntryIdSymbol: unique symbol;

export type AnilistEntryId = number & { [AnilistEntryIdSymbol]: never; };
