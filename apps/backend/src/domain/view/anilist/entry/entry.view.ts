import {MediaListStatus} from "../../../graphql/anilist/generated-types";
import {AnilistEntryId} from "@anistats/shared";
import {UpdateEntryView} from "./update-entry.view";

export class EntryView
{
	constructor(
		public id: AnilistEntryId,
		public status: MediaListStatus,
		public progress: number,
		public repeats: number,
	) {}
	
	update(): UpdateEntryView
	{
		return new UpdateEntryView(
			this.id,
			this.status,
			this.progress,
			this.repeats,
		);
	}
}
