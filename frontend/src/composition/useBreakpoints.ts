import {useMediaQuery} from "@vueuse/core";

export function useBreakpoints()
{
    // Keep in sync with _mixins.scss
    const mobile = useMediaQuery("only screen and (max-width: 992px)");
    const tablet = useMediaQuery("only screen and (min-width: 993px) and (max-width: 1280px)");
    const desktop = useMediaQuery("only screen and (min-width: 1281px)");

    return {
        mobile,
        tablet,
        desktop,
    }
}
