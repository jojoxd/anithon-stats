import {DurationLike} from "luxon";
import {AppImageConfiguration} from "./app-image-configuration.interface";

export interface AppConfiguration
{
	series: {
		syncTimeout: DurationLike;
	};

	image: AppImageConfiguration;
}
