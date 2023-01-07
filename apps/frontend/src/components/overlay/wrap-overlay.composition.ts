import {Overlay} from "./overlay.controller";
import {useOverlay} from "./use-overlay.composition";

export function wrapOverlay<T>(overlay: Overlay, cb: (overlay: Overlay) => Promise<T>): () => Promise<T> {
    const controller = useOverlay();

    return async () => {
        controller.show(overlay);

        const response = await cb(overlay);

        controller.hide();

        return response;
    };
}
