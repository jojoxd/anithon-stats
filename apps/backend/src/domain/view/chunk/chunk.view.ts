import {EntryView} from "../entry/entry.view";
import {ChunkStateEnum, EntryStatusEnum} from "@anistats/shared";

export class ChunkView
{
	constructor(
		public readonly entryView: EntryView,
		public readonly start: number,
		public readonly end: number,
		public readonly isJoined: boolean,
	) {}

	get state(): ChunkStateEnum
	{
		if (this.entryView.state === EntryStatusEnum.Dropped) {
			if (this.entryView.progress >= this.start && this.entryView.progress <= this.end) {
				return ChunkStateEnum.Dropped;
			}
		}

		if (this.entryView.progress >= this.end) {
			return ChunkStateEnum.Complete;
		}

		if (this.entryView.progress >= this.start && this.entryView.progress <= this.end) {
			return ChunkStateEnum.Started;
		}

		return ChunkStateEnum.NotStarted;
	}
}
