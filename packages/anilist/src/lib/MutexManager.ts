import {Mutex} from "async-mutex";

export class MutexManager
{
	readonly mutexes: { [k: string]: Mutex } = {};

	getMutex(key: string): Mutex
	{
		this.mutexes[key] ??= new Mutex();

		return this.mutexes[key]!;
	}
}

export const Mutexes = new MutexManager();
