export type Newable<T> = (new() => T) | Function;

export type Method<T> = (...args: any[]) => T;
