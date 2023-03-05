export class MathUtil
{
	public static clamp(v: number, min: number, max: number): number
	{
		return Math.min(max, Math.max(min, v));
	}
}
