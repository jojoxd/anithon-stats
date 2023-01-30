import {Ref} from "vue";

/**
 * Reference from store
 *
 * This type signifies the following:
 * - T: This is of type T
 * - undefined: The parent data is not available
 * - null: The data is not available, or is actually null
 */
export type StoreRef<T> = Ref<T | undefined | null>;
