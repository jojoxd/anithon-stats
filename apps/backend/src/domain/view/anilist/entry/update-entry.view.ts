import { AnilistEntryId } from "@anistats/shared";
import { MediaListStatus } from "../../../graphql/anilist/generated-types";

export class UpdateEntryView
{
	constructor(
		public readonly id: AnilistEntryId,
		public readonly status: MediaListStatus,
		public readonly progress: number,
		public readonly repeats: number,
	) {}
	
	withProgress(progress: number): UpdateEntryView
	{
		return new UpdateEntryView(
			this.id,
			this.status,
			progress,
			this.repeats,
		);
	}
	
	withRewatching() {
		return new UpdateEntryView(
			this.id,
			MediaListStatus.Repeating,
			0,
			this.repeats + 1,
		);
	}
	
	withWatching() {
		return new UpdateEntryView(
			this.id,
			MediaListStatus.Current,
			this.progress,
			this.repeats,
		);
	}
	
	withComplete() {
		return new UpdateEntryView(
			this.id,
			MediaListStatus.Completed,
			this.progress,
			this.repeats,
		);
	}
}
