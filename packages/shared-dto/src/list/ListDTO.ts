import {CollectionOf, Generics, Ignore, Property} from "@tsed/schema";
import {IList} from "@anistats/shared";

@Generics("T")
export class ListDTO<TData> implements IList<TData>
{
	@Ignore()
	protected backingData: IList<TData>;

	constructor(data: IList<TData>)
	{
		this.backingData = data;
	}

	@Property()
	@CollectionOf("T")
	public get items(): Array<TData>
	{
		return this.backingData.items;
	}
}
