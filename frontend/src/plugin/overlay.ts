import { App, Ref, ref } from "vue";

class OverlayController implements IOverlayController
{
    public readonly title: Ref<string> = ref("No Title");

    public readonly shown: Ref<boolean> = ref(false);

    public readonly withSpinner: Ref<boolean> = ref(false);

    show(title: string, spinner: boolean = false)
    {
        this.title.value = title;
        this.shown.value = true;

        this.withSpinner.value = spinner;
    }

    hide()
    {
        this.shown.value = false;
    }
}

export interface IOverlayController
{
    show(title: string): void;
    hide(): void;

    readonly title: Readonly<Ref<string>>;
    readonly shown: Readonly<Ref<boolean>>;
    readonly withSpinner: Readonly<Ref<boolean>>;
}

export default function createOverlayController()
{
    return {
        install: (app: App) => {
            app.config.globalProperties.$overlay = new OverlayController();

            // @ts-ignore TEST
            window.$overlay = app.config.globalProperties.$overlay;
        },
    };
}
