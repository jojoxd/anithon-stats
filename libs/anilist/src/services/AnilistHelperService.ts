"use strict";

import {Service} from "@tsed/di";
import {IFuzzyDate} from "..";

@Service()
export class AnilistHelperService
{
    convertFuzzyDate(fuzzyDate: IFuzzyDate | null): Date | null
    {
        if (fuzzyDate === null)
            return null;

        if (fuzzyDate.year === null || fuzzyDate.month === null || fuzzyDate.day === null)
            return null;

        return new Date(fuzzyDate.year, fuzzyDate.month, fuzzyDate.day, 0, 0, 0, 0);
    }
}