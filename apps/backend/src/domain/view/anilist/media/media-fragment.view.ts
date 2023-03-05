import { SeriesTitleDto, AnilistMediaId } from "@anistats/shared";
import { MediaFragmentData } from "../../../graphql/anilist/media/media.fragment.gql";

/**
 * Maps a MediaFragment
 */
export class MediaFragmentView
{
	constructor(
		protected readonly mediaData: MediaFragmentData,
	) {}

	public get id(): AnilistMediaId
	{
		return this.mediaData.id as AnilistMediaId;
	}

	public get title(): SeriesTitleDto
	{
		// @TODO: Sometimes these can be null
		return {
			romaji: this.mediaData.title!.romaji!,
			english: this.mediaData.title!.english!,
			native: this.mediaData.title!.native!,
		}
	}

	public get description(): string | null
	{
		return this.mediaData.description ?? null;
	}

	public get episodes(): number | null
	{
		return this.mediaData.episodes ?? null;
	}

	public get duration(): number | null
	{
		return this.mediaData.duration ?? null;
	}

	public get coverImage(): string
	{
		return this.mediaData.coverImage!.extraLarge!;
	}
}
