import {AnilistEntryId, EntryStatusEnum} from "@anistats/shared";
import {MediaListGroupEntry} from "../../../../graphql/anilist/list/get-user-lists.gql";
import {MediaListStatus} from "../../../../graphql/anilist/generated-types";
import {MediaFragmentView} from "../../media/media-fragment.view";
import {InternalServerError} from "@tsed/exceptions";

export class MediaListGroupEntryView
{
	constructor(
		protected readonly entryData: MediaListGroupEntry
	) {}

	public get id(): AnilistEntryId
	{
		return this.entryData.id as AnilistEntryId;
	}

	public get status(): MediaListStatus
	{
		return this.entryData.status!;
	}

	public get entryState(): EntryStatusEnum
	{
		switch(this.status) {
			case MediaListStatus.Completed:
				return EntryStatusEnum.Completed;
			case MediaListStatus.Current:
				return EntryStatusEnum.Current;
			case MediaListStatus.Dropped:
				return EntryStatusEnum.Dropped;
			case MediaListStatus.Paused:
				return EntryStatusEnum.Paused;
			case MediaListStatus.Planning:
				return EntryStatusEnum.Planning;
			case MediaListStatus.Repeating:
				return EntryStatusEnum.Repeating;
		}

		throw new InternalServerError("Could not map MediaListStatus to EntryStatusEnum");
	}

	public get progress(): number
	{
		return this.entryData.progress ?? 0;
	}

	public get media(): MediaFragmentView
	{
		return new MediaFragmentView(this.entryData.media!);
	}
}
