import { $log } from "@tsed/common";
import {EntryEntity} from "../../entity/entry/entry.entity";
import {ListSettingsEntity} from "../../entity/list/list-settings.entity";
import {EntryId, EntryStatusEnum} from "@anistats/shared";

export class EntryView
{
	constructor(
		protected entry: EntryEntity
	) {}

	protected get listSettings(): ListSettingsEntity
	{
		return this.entry.list.settings;
	}

	get id(): EntryId
	{
		return this.entry.id;
	}

	get episodeCount(): number
	{
		if (this.entry.series.episodes === null) {
			$log.warn(`Series ${this.entry.series.id} has no episodes, falling back to 1 episode`);

			return 1;
		}

		return this.entry.series.episodes - (this.entry.data.startAt ?? 0);
	}

	get totalTime(): number
	{
		return this.entry.series.duration * this.episodeCount * this.entry.data.mult;
	}

	get hasJoinedLastChunk(): boolean
	{
		if ((this.entry.data.split ?? 0) > 0) {
			return Math.floor(this.episodeCount / this.entry.data.split!) <= 1;
		}

		return this.totalTime % this.listSettings.maxChunkLength < (this.listSettings.maxChunkJoinLength);
	}

	get chunkCount(): number
	{
		if ((this.entry.data.split ?? 0) > 0) {
			// Ensure we are into range 1 - episodeCount
			return Math.min(Math.max(this.entry.data.split!, 1), this.episodeCount);
		}

		if (this.hasJoinedLastChunk) {
			// Join Last Chunk
			return Math.max(Math.floor(this.totalTime / this.listSettings.maxChunkLength), 1);
		}

		return Math.ceil(this.totalTime / this.listSettings.maxChunkLength);
	}

	get startAt(): number
	{
		return this.entry.data.startAt ?? 0;
	}

	get state(): EntryStatusEnum
	{
		// @TODO: Fix the typings here
		return this.entry.state;
	}

	get progress(): number
	{
		return this.entry.progress;
	}
}

