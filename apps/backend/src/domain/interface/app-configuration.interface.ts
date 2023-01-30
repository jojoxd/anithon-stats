import {DurationLike} from "luxon";

export interface AppConfiguration
{
	series: {
		syncTimeout: DurationLike;
	};
}
