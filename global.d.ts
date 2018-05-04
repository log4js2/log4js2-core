declare type Newable<T> = { new(...args: any[]): T; };
declare type Method<T> = (...args: any[]) => T;
