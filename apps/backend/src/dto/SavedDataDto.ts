import { SavedDataDto as BaseSavedDataDto } from "@anistats/shared";
import {Property} from "@tsed/schema";

export class SavedDataDto implements BaseSavedDataDto
{
	constructor(
		protected savedData?: BaseSavedDataDto
	) {}

	@Property()
	get mult(): number
	{
		return this.savedData?.mult ?? 1;
	}

	@Property()
	get order(): number
	{
		return this.savedData?.order ?? -1;
	}

	@Property()
	get split(): number | undefined
	{
		return this.savedData?.split;
	}

	@Property()
	get splitSequelEntry(): boolean | undefined
	{
		return this.savedData?.splitSequelEntry;
	}

	@Property()
	get startAt(): number | undefined
	{
		return this.savedData?.startAt;
	}
}
