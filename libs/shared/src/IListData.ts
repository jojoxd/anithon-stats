import {IUserData} from "./user/IUserData";

/**
 * @deprecated use ListDataResponse instead
 */
export interface IListData
{
	user: IUserData;

    lists: Array<{
        id: string;
        name: string;

        meta: {
            totalDuration: number;
        }
    }>;
}
