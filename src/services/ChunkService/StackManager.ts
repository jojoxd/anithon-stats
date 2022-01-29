import {$log} from "@tsed/common";
import {Chunk} from "./Chunk";

/**
 * Chunk "Stack" Manager
 */
export class StackManager
{
    protected pointer: number = 0;

    protected stack: Array<Array<Chunk>>;

    protected chunks: Array<Array<Chunk>>;

    protected size: number;

    protected _done: boolean = false;

    constructor(chunks: Array<Array<Chunk>>, size: number = 3)
    {
        this.stack = [];
        this.chunks = chunks;

        this.size = size;
    }

    get totalSize(): number
    {
        return this.chunks.reduce((acc, chunk) => {
            acc += chunk.length + 1;
            return acc;
        }, 0);
    }

    get done(): boolean
    {
        return this._done;
    }

    *next()
    {
        // Pre-populate stack
        for(let i = 0; i < this.size; i++) {
            this.stack[i] = this.chunks.shift() ?? [];
        }

        this._done = false;

        while(!this._done) {
            $log.info('sp = %s', this.pointer);

            if(!this.stack[this.pointer] || this.stack[this.pointer].length === 0) {
                // update this.stack[this.pointer]
                this.stack[this.pointer] = this.chunks.shift() ?? [];

                $log.info('update this.stack[sp=%s] (%s) cl=%s', this.pointer, this.stack[this.pointer], this.chunks.length);
            }

            if(this.stack[this.pointer].length > 0) {
                const chunk = this.stack[this.pointer].shift()!;

                yield chunk;
            } else {
                $log.info('Empty this.stack[%s]', this.pointer);

                $log.info(new Error().stack);
            }

            // Always update this.stack Pointer
            this.pointer = (this.pointer + 1) % this.size;
            this._done = this.stack.every(sp => sp.length === 0) && this.chunks.length === 0;
        }
    }
}
