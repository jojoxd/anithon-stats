import {IMetadata, ISavedData} from "@anistats/shared";
import {Property} from "@tsed/schema";
import {UserList} from "../../entity/UserList";

export class MetadataImpl implements IMetadata
{
	constructor(userList: UserList)
	{
		this.allowChunkMerge = userList.allowChunkMerge;

		this.savedData = userList.savedData.data;
	}

	@Property()
	allowChunkMerge?: boolean;

	@Property()
	savedData?: { [key: string]: ISavedData };
}
