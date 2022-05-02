import { App, Ref, ref } from "vue";

class OverlayController implements IOverlayController
{
    public readonly title: Ref<string> = ref("No Title");

    public readonly content: Ref<string | null> = ref(null);

    public readonly shown: Ref<boolean> = ref(false);

    public readonly withSpinner: Ref<boolean> = ref(false);

    public readonly hasContent: Ref<boolean> = ref(false);

    show(title: string, content: string | null = null, spinner: boolean = false)
    {
        this.title.value = title;
        this.content.value = content;
        this.shown.value = true;

        this.hasContent.value = this.content.value !== null;

        this.withSpinner.value = spinner;
    }

    hide()
    {
        this.shown.value = false;
    }
}

export interface IOverlayController
{
    show(title: string, content: string | null, spinner: boolean): void;
    hide(): void;

    readonly title: Readonly<Ref<string>>;
    readonly content: Readonly<Ref<string | null>>;
    readonly shown: Readonly<Ref<boolean>>;
    readonly withSpinner: Readonly<Ref<boolean>>;
    readonly hasContent: Readonly<Ref<boolean>>;
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
