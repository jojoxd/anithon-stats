import {Service} from "@tsed/di";
import {ListEntity} from "../../entity/list/list.entity";
import {ChunkDto, ChunkListDto, EntryId} from "@anistats/shared";
import {EntryView} from "../../view/entry/entry.view";
import {ChunkView} from "../../view/chunk/chunk.view";

@Service()
export class ListChunkDomainService
{
	public async getChunkList(list: ListEntity): Promise<ChunkListDto>
	{
		return {
			items: await this.getChunks(list),
		};
	}

	public async getChunks(list: ListEntity): Promise<Array<ChunkDto>>
	{
		const chunks: Record<EntryId, Array<ChunkView>> = {};

		for(const entry of list.entries) {
			const entryView = new EntryView(entry);

			chunks[entry.id] = await this.createChunks(entryView);

			// @TODO: Sequels under parent entry
		}

		// @TODO: Flatten

		// @DEBUG
		return [];
	}

	protected async createChunks(entryView: EntryView): Promise<Array<ChunkView>>
	{
		const chunks: Array<ChunkView> = [];
		let lastEnd = entryView.startAt;

		if (entryView.chunkCount > 1) {
			for(let chunkNumber = 0; chunkNumber < entryView.chunkCount; chunkNumber++) {
				let episodes = Math.floor(entryView.episodeCount / entryView.chunkCount);

				if (chunkNumber === entryView.chunkCount - 1 && entryView.hasJoinedLastChunk) {
					chunks.push(new ChunkView(entryView, lastEnd + 1, entryView.episodeCount, true));
				} else {
					chunks.push(new ChunkView(entryView, lastEnd + 1, lastEnd + episodes, false));

					lastEnd = lastEnd + episodes;
				}
			}
		} else {
			chunks.push(new ChunkView(entryView, lastEnd + 1, lastEnd + entryView.episodeCount, false));
		}

		return chunks;
	}

	protected merge(a: ChunkView, b: ChunkView): ChunkView
	{
		if (a.entryView.id !== b.entryView.id) {
			throw new Error("Entries are not the same, cannot merge");
		}

		return new ChunkView(
			a.entryView,
			Math.min(a.start, b.start),
			Math.max(a.end, b.end),
			true,
		);
	}
}
