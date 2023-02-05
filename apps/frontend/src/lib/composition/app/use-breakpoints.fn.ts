import { useBreakpoints as vueUseBreakpoints, breakpointsVuetify, } from "@vueuse/core";

export function useBreakpoints()
{
    const breakpoints = vueUseBreakpoints(breakpointsVuetify);

    const isMobile = breakpoints.smaller('md');

    return {
        breakpoints,

        isMobile,
    };
}
