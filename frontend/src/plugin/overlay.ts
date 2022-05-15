import { App, Ref, ref } from "vue";
import {Router} from "vue-router";

class OverlayController implements IOverlayController
{
    public readonly title: Ref<string> = ref("No Title");

    public readonly content: Ref<string | null> = ref(null);

    public readonly shown: Ref<boolean> = ref(false);

    public readonly withSpinner: Ref<boolean> = ref(false);

    public readonly hasContent: Ref<boolean> = ref(false);

    constructor(router: Router)
    {
        // Setup router to auto-hide the overlay
        router.beforeEach(() => {
            this.hide();
        });
    }

    public show(title: string, content: string | null = null, spinner: boolean = false): void
    {
    	console.log(`OverlayController: show(${title})`);

        this.setHtmlOverflow("hidden");

        this.title.value = title;
        this.content.value = content;
        this.shown.value = true;

        this.hasContent.value = this.content.value !== null;

        this.withSpinner.value = spinner;
    }

    public hide(): void
    {
    	console.log(`OverlayController: hide(${this.title.value})`);

        this.setHtmlOverflow(null);
        this.shown.value = false;
    }

    protected setHtmlOverflow(value: "hidden" | null)
    {
        const htmlElement = document.querySelector("html");

        if(htmlElement) {
            htmlElement.style.setProperty("overflow", value);
        }
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

export default function createOverlayController(router: Router)
{
    return {
        install: (app: App) => {
            app.config.globalProperties.$overlay = new OverlayController(router);

            // @ts-ignore TEST
            window.$overlay = app.config.globalProperties.$overlay;
        },
    };
}
