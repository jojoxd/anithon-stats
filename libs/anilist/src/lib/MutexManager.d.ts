import { Mutex } from "async-mutex";
export declare class MutexManager {
    readonly mutexes: {
        [k: string]: Mutex;
    };
    getMutex(key: string): Mutex;
}
export declare const Mutexes: MutexManager;
//# sourceMappingURL=MutexManager.d.ts.map