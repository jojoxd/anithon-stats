import { MaybeRef, get } from "@vueuse/core";
import { ComputedRef, computed } from "vue";

export function ensureRef<T>(maybeRef: MaybeRef<T>): ComputedRef<T>
{
    return computed(() => get(maybeRef));
}