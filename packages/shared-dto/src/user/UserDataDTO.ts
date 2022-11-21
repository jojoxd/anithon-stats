import {IUserData} from "@anistats/shared";
import {Ignore, Property} from "@tsed/schema";

export class UserDataDTO implements IUserData
{
	@Ignore()
	protected backingData: IUserData;

	constructor(userData: IUserData)
	{
		this.backingData = userData;
	}

	@Property()
	public get uuid(): string
	{
		return this.backingData.uuid;
	};

	@Property()
	public get anilistId(): number
	{
		return this.backingData.anilistId;
	};

	@Property()
	public get name(): string
	{
		return this.backingData.name;
	};

	@Property()
	public get avatar(): string
	{
		return this.backingData.avatar;
	};

	@Property()
	public get isCurrentUser(): boolean
	{
		return this.backingData.isCurrentUser;
	};
}
