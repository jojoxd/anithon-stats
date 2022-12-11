import {SearchItemUserDto} from "./item/search-item-user.dto";
import {SearchItemListDto} from "./item/search-item-list.dto";

export interface SearchResponse
{
	users: Array<SearchItemUserDto>;

	lists: Array<SearchItemListDto>;
}
