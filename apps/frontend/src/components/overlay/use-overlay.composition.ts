import {OverlayController} from "./overlay.controller";
import { inject } from "vue";

export const OVERLAY_KEY = Symbol('@jojoxd/vuetify-overlay');

export function useOverlay(): OverlayController
{
    return inject(OVERLAY_KEY) as OverlayController;
}
