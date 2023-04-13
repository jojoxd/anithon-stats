import { EntryView } from "../entry/entry.view";
import {ChunkView} from "./chunk.view";

export class ChunkTreeView
{
	private _child: ChunkTreeView | null = null;
	private _parent: ChunkTreeView | null = null;

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

		if (child && child?.parent !== this) {
			child.parent = this;
		}
	}

	get parent(): ChunkTreeView | null
	{
		return this._parent;
	}

	set parent(parent: ChunkTreeView | null)
	{
		this._parent = parent;

		if (parent && parent.child !== this) {
			parent.child = this;
		}
	}

	/**
     * Iterate over the chunks of this ChunkTreeView and it's children
     */
	*iterate(): Generator<ChunkView>
	{
		for (const chunkView of this.chunkViews) {
			chunkView.chunkTreeView = this;
			yield chunkView;
		}

		if (this.child) {
			yield* this.child.iterate();
		}
	}
}
