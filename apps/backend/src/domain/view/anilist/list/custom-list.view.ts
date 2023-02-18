import { Scalars } from "../../../graphql/anilist/generated-types";

export class CustomListView
{
	constructor(
		private readonly data: Scalars['Json']
	) {}

	public get name(): string
	{
		return this.data.name;
	}

	public get enabled(): boolean
	{
		return this.data.enabled;
	}
}