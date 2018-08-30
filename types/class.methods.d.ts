type Bool = 'true' | 'false';

type Not<X extends Bool> = {
    true: 'false',
    false: 'true'
}[X];

type HaveIntersection<S1 extends string, S2 extends string> = (
    { [K in S1]: 'true' } &
    { [key: string]: 'false' }
    )[S2];

type IsNeverWorker<S extends string> = (
    { [K in S]: 'false' } &
    { [key: string]: 'true' }
    )[S];

type IsNever<T extends string> = Not<HaveIntersection<IsNeverWorker<T>, 'false'>>;

// @ts-ignore
type IsFunction<T> = IsNever<keyof T>;

type NonFunctionProps<T> = {
    [K in keyof T]: {
        'false': K,
        'true': never
    }[IsFunction<T[K]>]
}[keyof T];

type FunctionProps<T> = {
    [K in keyof T]: {
        'false': never,
        'true': K
    }[IsFunction<T[K]>]
}[keyof T];
