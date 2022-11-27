export interface ISearchResponse
{
	items: Array<SearchItem>
}

export type SearchItem = ISearchItemUser | ISearchItemList;

export interface ISearchItemUser
{
	type: 'user';

	name: string;

	uuid: string;
}

export interface ISearchItemList
{
	type: 'list';

	name: string;

	uuid: string;
}
