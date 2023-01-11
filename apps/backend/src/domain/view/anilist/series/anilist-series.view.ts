import {MediaRelation, SeriesDataFragmentFragment} from "../../../graphql/anilist/generated-types";
import {SeriesTitleDto} from "@anistats/shared";

export class AnilistSeriesView
{
	constructor(
		protected readonly seriesData: SeriesDataFragmentFragment
	) {}

	get id(): any
	{
		return this.seriesData.id;
	}

	public get prequelIds(): Array<any>
	{
		return this.getRelationIdsOfType(MediaRelation.Prequel);
	}

	public get sequelIds(): Array<any>
	{
		return this.getRelationIdsOfType(MediaRelation.Sequel);
	}

	protected getRelationIdsOfType(mediaRelation: MediaRelation): Array<any>
	{
		return this.seriesData.relations!.edges!.filter((edge) => {
			return edge!.relationType === mediaRelation;
		}).map(edge => edge!.node!.id!);
	}

	get title(): SeriesTitleDto
	{
		// @TODO: Sometimes these will be null
		return {
			romaji: this.seriesData.title!.romaji!,
			english: this.seriesData.title!.english!,
			native: this.seriesData.title!.native!,
		}
	}

	get description(): string | null
	{
		return this.seriesData.description ?? null;
	}

	get episodeCount(): number | null
	{
		return this.seriesData.episodes ?? null;
	}

	get duration(): number | null
	{
		return this.seriesData.duration ?? null;
	}

	get coverImage(): string
	{
		return this.seriesData.coverImage!.extraLarge!;
	}
}
