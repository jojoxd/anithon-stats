import {IUserData} from "./user/IUserData";

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
