<script lang="ts">
    import { defineComponent, provide } from "vue";
    import {OverlayController} from "./overlay.controller";
    import {OVERLAY_KEY} from "./use-overlay.composition";

    export default defineComponent({
        setup() {
            const controller = new OverlayController();

            provide(OVERLAY_KEY, controller);

            return {
                isActive: controller.isActive,
                canClose: controller.canClose,
                component: controller.component,
                onClose: () => controller.canClose.value && controller.hide(),
            };
        },
    });
</script>

<template>
    <slot name="default"></slot>

    <v-overlay
        absolute
        content-class="w-100 h-100vh"
        :model-value="isActive"
        @click.prevent="onClose"
        :close-on-content-click="canClose"
        class="scrim-fix"
    >
        <component
            :is="component"
        ></component>
    </v-overlay>
</template>

<style lang="scss" scoped>
    :global(.h-100vh) {
        height: 100vh !important;
    }

    .scrim-fix:deep(.v-overlay__scrim) {
        z-index: 2002 !important;
    }
</style>