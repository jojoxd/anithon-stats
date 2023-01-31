import { get } from "@vueuse/core";
import {Ref, ComputedRef, computed} from "vue";

export function computedExtract<T, V>(ref: Ref<T>, fn: (data: T) => V): ComputedRef<V>
{
    return computed(() => {
        const _ref = get(ref);

        return fn(_ref);
    });
}
