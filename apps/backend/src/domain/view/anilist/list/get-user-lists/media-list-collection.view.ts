import { MediaListGroupView } from "./media-list-group.view";
import { MediaListCollection } from "../../../../graphql/anilist/list/get-user-lists.gql";

export class MediaListCollectionView
{
	constructor(
		protected mediaListCollection: MediaListCollection
	) {}

	public get lists(): Array<MediaListGroupView>
	{
		return this.mediaListCollection.lists!.map((mediaListGroup) => {
			return new MediaListGroupView(mediaListGroup!);
		});
	}
}
