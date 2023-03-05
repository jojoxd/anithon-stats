import {MediaListGroupEntryView} from "./media-list-group-entry.view";
import { MediaListGroup } from "../../../../graphql/anilist/list/get-user-lists.gql";

export class MediaListGroupView
{
	constructor(
		protected readonly listData: MediaListGroup,
	) {}

	public get name(): string
	{
		return this.listData.name!;
	}

	public get entries(): Array<MediaListGroupEntryView>
	{
		return this.listData.entries!.map((entry) => new MediaListGroupEntryView(entry!));
	}
}
