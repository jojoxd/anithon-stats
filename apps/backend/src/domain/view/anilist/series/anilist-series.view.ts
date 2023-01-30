import {MediaRelation, MediaType} from "../../../graphql/anilist/generated-types";
import {AnilistSeriesId, SeriesTitleDto} from "@anistats/shared";
import {isSeriesView} from "../../../graphql/anilist/series";
import { SeriesViewRelated } from "../../../graphql/anilist/series/series-view-related.fragment.gql";

export class AnilistSeriesView
{
	constructor(
			protected readonly seriesData: SeriesViewRelated
	) {}

	get id(): AnilistSeriesId
	{
		return this.seriesData.id as AnilistSeriesId;
	}

	public get prequelIds(): Array<any>
	{
		return this.getRelationIdsOfType(MediaRelation.Prequel);
	}

	public get sequelIds(): Array<any>
	{
		return this.getRelationIdsOfType(MediaRelation.Sequel);
	}

	/**
	 * Returns null when we don't have any edges registered (e.g. on a normal SeriesView)
     */
	public get relations(): Array<AnilistSeriesView> | null
	{
		return this.seriesData.relations?.edges?.reduce((acc, edge) => {
			if (isSeriesView(edge!.node!)) {
				acc.push(new AnilistSeriesView(edge!.node!));
			}

			return acc;
		}, [] as Array<AnilistSeriesView>) ?? null;
	}

	protected getRelationIdsOfType(mediaRelation: MediaRelation): Array<any>
	{
		return this.seriesData.relations?.edges?.filter((edge) => {
			return edge!.relationType === mediaRelation && edge!.node!.type! === MediaType.Anime;
		}).map(edge => edge!.node!.id!) ?? [];
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
