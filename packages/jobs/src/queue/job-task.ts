
export abstract class JobTask<T = any> {
    readonly name: string;

    constructor(readonly data: T) {
        this.name = this.constructor.name;
    }

    abstract execute(): Promise<void>;

    toJSON(): T {
        return this.data;
    }
}
