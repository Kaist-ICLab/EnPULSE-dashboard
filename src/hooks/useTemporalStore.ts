import { useStoreWithEqualityFn } from "zustand/traditional";
import type { TemporalState } from "zundo";
import { UseBoundStore, StoreApi } from "zustand";

// Copied from zundo/dist/index.d.ts
type Write<T, U> = Omit<T, keyof U> & U;
type StoreWithZundo<T> = UseBoundStore<Write<StoreApi<T>, {
    temporal: StoreApi<TemporalState<T>>;
}>>


export function useTemporalStore<K, T>(storeWithZundo: StoreWithZundo<K>, selector: (state: TemporalState<K>) => T, equality?: (a: T, b: T) => boolean): T {
    return useStoreWithEqualityFn(storeWithZundo.temporal, selector, equality);
}