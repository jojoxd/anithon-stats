import {EntryView} from "../entry/entry.view";
import {ChunkStateEnum, EntryStatusEnum} from "@anistats/shared";
import {MathUtil} from "../../util/math.util";

export class ChunkView
{
	constructor(
		public readonly entryView: EntryView,
		public readonly start: number,
		public readonly end: number,
		public readonly isJoined: boolean,
	) {}

	public get state(): ChunkStateEnum
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

	public get progress(): number
	{
		const entryProgress = this.entryView.progress;

		console.log(`clamp(${entryProgress}, min=${this.start}, max=${this.end}) - ${this.start} = ${MathUtil.clamp(entryProgress, this.start, this.end) - this.start}`);

		if (entryProgress === 0) {
			return 0;
		}

		return MathUtil.clamp(entryProgress, this.start, this.end) - this.start;
	}
}
