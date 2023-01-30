import { StoreRef } from "./store-ref.type";

export type MaybeStoreRef<T> = StoreRef<T> | T | undefined | null;
