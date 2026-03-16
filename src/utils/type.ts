/**
 * Recursively makes all properties of a type required, including nested properties.
 * This is useful when you want to ensure that optional fields and their nested properties are all required.
 */
export type DeepRequired<T> = T extends object
    ? {
        [P in keyof T]-?: DeepRequired<T[P]>;
    }
    : T;

export type MakeOptional<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;

/**
 * Rust-inspired Result type
 */
export type Ok<T> = { data: T }
export type Error = { errorMessage: string }
export type Result<T> = Ok<T> | Error;