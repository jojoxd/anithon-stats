declare const AnilistMediaIdSymbol: unique symbol;

export type AnilistMediaId = number & { [AnilistMediaIdSymbol]: never; };
