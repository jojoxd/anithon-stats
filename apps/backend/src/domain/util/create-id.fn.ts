import { v4 as uuid4 } from "uuid";

export function createId<T = string>(): T
{
	return uuid4() as unknown as T;
}
