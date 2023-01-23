import {DateTime, DurationLike} from "luxon";

type DateObject = Date | DateTime | null | undefined;

export class TimeUtil
{
	static hasTimedOut(date: DateObject, duration: DurationLike, from?: DateTime): boolean
	{
		if (!date) {
			return true;
		}

		from ??= DateTime.now();

		if (date instanceof Date) {
			date = DateTime.fromJSDate(date);
		}

		return date < from.minus(duration);
	}
}
