declare const AnilistUserIdSymbol: unique symbol;

// We don't assume types of external entity id's
export type AnilistUserId = any & { [AnilistUserIdSymbol]: never; };
