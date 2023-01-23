import { PageViewFragment } from "../../../graphql/anilist/generated-types";

export class AnilistPageView<TData>
{
	private readonly _items: TData[];

	constructor(protected page: PageViewFragment, items: TData[])
	{
		this._items = items;
	}

	public get hasNextPage(): boolean
	{
		return this.page.pageInfo!.hasNextPage!;
	}

	public get currentPage(): number
	{
		return this.page.pageInfo!.currentPage!;
	}

	public get totalPages(): number
	{
		return this.page.pageInfo!.total!;
	}

	public get items(): TData[]
	{
		return this._items;
	}
}
