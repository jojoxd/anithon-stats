import {AnilistSeriesView} from "../series/anilist-series.view";

export class AnilistListView
{
	constructor(
		public readonly name: string,
		public readonly entries: Array<AnilistSeriesView>
	) {}
}
