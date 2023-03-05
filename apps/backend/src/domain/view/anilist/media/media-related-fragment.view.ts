import {MediaRelation, MediaType} from "../../../graphql/anilist/generated-types";
import { AnilistMediaId } from "@anistats/shared";
import {MediaFragmentView} from "./media-fragment.view";
import {MediaRelatedFragmentData} from "../../../graphql/anilist/media/media-related.fragment.gql";

/**
 * Maps a SeriesRelatedFragment
 */
export class MediaRelatedFragmentView extends MediaFragmentView
{
	constructor(
		protected mediaViewRelated: MediaRelatedFragmentData,
	) {
		super(mediaViewRelated);
	}

	public get prequels(): Array<MediaFragmentView>
	{
		return this.getRelationsOfType(MediaRelation.Prequel);
	}

	public get sequels(): Array<MediaFragmentView>
	{
		return this.getRelationsOfType(MediaRelation.Sequel);
	}

	protected getRelationsOfType(mediaRelation: MediaRelation): Array<MediaFragmentView>
	{
		return this.mediaViewRelated.relations!.edges!
			.filter((edge) => {
				return edge!.relationType === mediaRelation && edge!.node!.type! === MediaType.Anime;
			}).map((edge) => {
				return new MediaFragmentView(edge!.node!);
			});
	}
}
