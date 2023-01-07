import {SearchGlobalUserDto} from "../../../dto/search/global/search-global-user.dto";
import {SearchGlobalListDto} from "../../../dto/search/global/search-global-list.dto";

export interface SearchGlobalResponse
{
    users: Array<SearchGlobalUserDto>;

    lists?: Array<SearchGlobalListDto>;
}