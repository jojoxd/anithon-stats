import { EntryView } from "../entry/entry.view";
import {ChunkView} from "./chunk.view";

export class ChunkTreeView
{
	private _child: ChunkTreeView | null = null;

	constructor(
		public readonly entryView: EntryView,
		public readonly chunkViews: Array<ChunkView>,
	) {}

	get child(): ChunkTreeView | null
	{
		return this._child;
	}

	set child(child: ChunkTreeView | null)
	{
		this._child = child;
	}

	/**
     * Iterate over the chunks of this ChunkTreeView and it's children
     */
	*iterate(): Generator<ChunkView>
	{
		for (const chunkView of this.chunkViews) {
			console.log('yield', { chunkView });
			yield chunkView;
		}

		if (this.child) {
			yield* this.child.iterate();
		}
	}
}
