import {Service} from "@tsed/di";
import {ListEntity} from "../../../entity/list/list.entity";
import {ChunkDto, ChunkListDto} from "@anistats/shared";
import {EntryView} from "../../../view/entry/entry.view";
import {ChunkView} from "../../../view/chunk/chunk.view";
import {ChunkTreeView} from "../../../view/chunk/chunk-tree.view";
import { $log } from "@tsed/common";
import {inspect} from "util";
import {StackManager} from "../../../util/stack-manager";

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
		$log.info('>>>> CHUNKS - GET CHUNKS');

		await list.entries.loadItems();

		const chunkTreeViews = [];
		for(const entry of list.entries) {
			const entryView = new EntryView(entry);
			const entryChunks = await this.createChunks(entryView);

			chunkTreeViews.push(new ChunkTreeView(entryView, entryChunks));
		}

		$log.info('>>>> CHUNKS - ENTRIES MAPPED', { chunkTreeViews });

		const sequelChunkTreeViews: Array<ChunkTreeView> = [];
		for(const chunkTreeView of chunkTreeViews) {
			const entry = chunkTreeView.entryView.entry;
			const entrySeries = await entry.series.load();
			await entrySeries.sequels.loadItems();

			$log.info('> LOADED ENTRY AND SERIES', entrySeries.title);

			if (entry.customSequel) {
				const customSequelChunkTreeView = chunkTreeViews.find((_chunkTreeView) => {
					return entry.customSequel!.id === _chunkTreeView.entryView.entry.id;
				});

				if (chunkTreeView.child && customSequelChunkTreeView) {
					$log.warn("MULTIPLE SEQUELS FOUND, WE ARE OVERWRITING STUFF", { chunkTreeView, customSequelChunkTreeView, });
				}

				if (customSequelChunkTreeView) {
					$log.info(' NOTE: REMOVING CUSTOM SEQUEL CHUNK', { customSequelChunkTreeView, });
					sequelChunkTreeViews.push(customSequelChunkTreeView);
				}

				chunkTreeView.child = customSequelChunkTreeView ?? null;

				continue;
			}

			// Map sequel
			if (!entry.data.splitSequelEntry) {
				const sequelSeriesIds = entrySeries.sequels.getIdentifiers();

				const sequelChunkTreeView = chunkTreeViews.find((_chunkTreeView) => {
					return sequelSeriesIds.includes(_chunkTreeView.entryView.entry.series.id);
				});

				if (chunkTreeView.child && sequelChunkTreeView) {
					$log.warn("MULTIPLE SEQUELS FOUND, WE ARE OVERWRITING STUFF", { chunkTreeView, sequelChunkTreeView, });
				}

				// Set remove flag
				if (sequelChunkTreeView) {
					$log.info('NOTE: REMOVING SEQUEL CHUNK', { sequelChunkTreeView });
					sequelChunkTreeViews.push(sequelChunkTreeView);
				}

				chunkTreeView.child = sequelChunkTreeView ?? null;
			}
		}

		$log.info('>>>> CHUNKS - SEQUELS MAPPED');

		// Remove sequels, add order
		const normalizedChunkTreeViews = chunkTreeViews
			.filter((chunkTreeView) => {
				return !sequelChunkTreeViews.includes(chunkTreeView);
			}).sort((chunkTreeViewA, chunkTreeViewB) => {
				const orderA = chunkTreeViewA.entryView.order;
				const orderB = chunkTreeViewB.entryView.order;

				if (orderA !== null && orderB !== null) {
					return orderA - orderB;
				}

				// @TODO: Check for null in both
				return 0;
			});

		$log.info('>>>> CHUNKS - CHUNK TREE NORMALIZED');

		$log.info(inspect(normalizedChunkTreeViews, { depth: 3, colors: true, getters: true, }));

		// @TODO: Allow setting stack size in list
		const generators = normalizedChunkTreeViews.map((chunkTreeView) => chunkTreeView.iterate());
		const stackManager = new StackManager(3);
		const orderedChunks: Array<ChunkView | null> = stackManager.toArray(generators);

		// Merge chunks again, as there could be trailing, unmatched chunks from the StackManager
		for(let i = 0; i < orderedChunks.length - 1; i++) {
			const chunkA = orderedChunks[i]!;
			const chunkB = orderedChunks[i + 1]!;

			if (chunkA.entryView.id === chunkB.entryView.id) {
				orderedChunks[i] = null;
				orderedChunks[i + 1] = this.merge(chunkA, chunkB);
			}
		}

		return orderedChunks
			.filter(chunkView => chunkView !== null)
			.map(chunkView => {
				$log.info('>> MAPPING CHUNK', chunkView);
				return this.createDto(chunkView!);
			});
	}

	protected async createChunks(entryView: EntryView): Promise<Array<ChunkView>>
	{
		const chunks: Array<ChunkView> = [];
		let lastEnd = entryView.startAt;

		console.log('cc', entryView.chunkCount);

		if (entryView.chunkCount > 1) {
			for(let chunkNumber = 0; chunkNumber < entryView.chunkCount; chunkNumber++) {
				const episodes = Math.floor(entryView.episodeCount / entryView.chunkCount);
				console.log('cepisodes', { episodes, totalEpisodes: entryView.episodeCount, chunkCount: entryView.chunkCount, });

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

		const chunkView = new ChunkView(
			a.entryView,
			Math.min(a.start, b.start),
			Math.max(a.end, b.end),
			true,
		);

		chunkView.chunkTreeView = a.chunkTreeView;

		return chunkView;
	}

	protected getRootChunkTreeView(chunkTreeView: ChunkTreeView): ChunkTreeView
	{
		let last = chunkTreeView;
		while((last.parent ?? null) !== null) {
			last = last.parent!;
		}

		return last;
	}

	public createDto(chunkView: ChunkView): ChunkDto
	{
		return {
			entry: {
				ref: chunkView.entryView.id,
			},

			rootEntry: {
				ref: this.getRootChunkTreeView(chunkView.chunkTreeView).entryView.id,
			},

			start: chunkView.start,
			end: chunkView.end,
			progress: chunkView.progress,

			isJoined: chunkView.isJoined,
			state: chunkView.state,
		};
	}
}
