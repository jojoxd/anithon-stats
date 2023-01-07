import { MaybeRef, get } from "@vueuse/core";
import { ComputedRef, computed, ref, Ref, Component, markRaw } from "vue";
import DefaultOverlay from "./default.overlay.vue";

export interface Overlay
{
    title: MaybeRef<string>;

    content: MaybeRef<string>;

    component?: Component;

    showSpinner?: MaybeRef<boolean>;
}

export class OverlayController
{
    private overlay: Ref<Overlay | null> = ref(null);

    public show(overlay: Overlay) {
        console.log('Show overlay', overlay);

        this.overlay.value = overlay;
    }

    public hide() {
        console.log('Hide overlay', this.overlay);

        this.overlay.value = null;
    }

    public get isActive(): ComputedRef<boolean>
    {
        return computed(() => {
            return get(this.overlay.value) !== null;
        });
    }

    public get title(): ComputedRef<string | null>
    {
        return computed(() => {
            return get(this.overlay.value?.title) ?? null;
        });
    }

    public get showSpinner(): ComputedRef<boolean>
    {
        return computed(() => {
            return get(this.overlay.value?.showSpinner) ?? false;
        })
    }

    public get content(): ComputedRef<string | null>
    {
        return computed(() => {
            return get(this.overlay.value?.content) ?? null;
        });
    }

    public get component(): ComputedRef<Component>
    {
        return computed(() => {
            return markRaw(this.overlay.value?.component ?? DefaultOverlay);
        });
    }

    public get canClose(): ComputedRef<boolean>
    {
        return computed(() => {
            return false;
        });
    }
}
