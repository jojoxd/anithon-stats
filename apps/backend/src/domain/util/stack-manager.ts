import {$log} from "@tsed/common";

export class StackManager
{
	constructor(
		protected readonly stackSize = 3,
	) {}

	protected *next<T>(generators: Array<Generator<T>>): Generator<T>
	{
		let done = false;
		let pointer = 0;

		const stack: Array<Generator<T> | null> = generators.splice(0, this.stackSize);

		while(!done) {
			$log.debug('[StackManager] sp = %s', pointer);

			const {
				done: generatorDone,
				value,
			} = stack[pointer]?.next() ?? { done: true, value: null, };

			if (generatorDone) {
				$log.info('[StackManager] sp = %s is done', pointer);
				stack[pointer] = generators.shift() ?? null;
			}

			if (value) {
				$log.info('[StackManager] sp = %s return value', pointer);
				yield value;
			}

			pointer = (pointer + 1) % this.stackSize;
			$log.info('[StackManager] update sp to ', pointer);
			done = stack.filter(stackItem => stackItem !== null).length === 0;
		}

		return;
	}

	public toArray<T>(generators: Array<Generator<T>>): Array<T>
	{
		return Array.from(this.next(generators));
	}
}
