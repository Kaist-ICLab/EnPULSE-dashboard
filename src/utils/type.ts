/**
 * Recursively makes all properties of a type required, including nested properties.
 * This is useful when you want to ensure that optional fields and their nested properties are all required.
 */
export type DeepRequired<T> = T extends object
    ? {
        [P in keyof T]-?: DeepRequired<T[P]>;
    }
    : T;

/**
 * Rust-inspired Result type
 */
export type Ok<T> = { ok: true; data: T };
export type Err<E = string> = { ok: false; error: E };
export type Result<T, E = string> = Ok<T> | Err<E>;

export const Ok = <T>(data: T): Ok<T> => ({ ok: true, data });
export const Err = <E = string>(error: E): Err<E> => ({ ok: false, error });

export function omit<T extends object, K extends keyof T>(
    obj: T,
    ...keys: K[]
): Omit<T, K> {
    const result = { ...obj };
    for (const key of keys) {
        delete (result as Partial<T>)[key];
    }
    return result;
}