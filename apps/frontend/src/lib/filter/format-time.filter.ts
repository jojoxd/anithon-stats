import { DurationLike, Duration } from "luxon";

export function formatTime(duration: DurationLike): string
{
    const _duration = Duration.fromDurationLike(duration).shiftTo('hours');

    if (_duration.hours >= 1) {
        return _duration.toFormat('hh:mm:ss');
    }

    return _duration.toFormat('mm:ss');
}
