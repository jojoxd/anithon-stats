import {ISeriesData, ISeriesTitle} from "@anistats/shared";
import {Ignore, Property} from "@tsed/schema";

export class SeriesDataDTO implements ISeriesData
{
	@Ignore()
	protected backingData: ISeriesData;

	constructor(seriesData: ISeriesData)
	{
		this.backingData = seriesData;
	}

	@Property()
	public get coverImage(): string
	{
		return this.backingData.coverImage;
	}

	@Property()
	public get description(): string | null
	{
		return this.backingData.description;
	}

	@Property()
	public get duration(): number
	{
		return this.backingData.duration;
	}

	@Property()
	public get episodes(): number | null
	{
		return this.backingData.episodes;
	}

	@Property()
	public get id(): number
	{
		return this.backingData.id;
	}

	@Property()
	public get notes(): string | null
	{
		return this.backingData.notes;
	}

	@Property()
	public get title(): ISeriesTitle
	{
		return this.backingData.title;
	}
}
