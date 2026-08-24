import type { TemporalState } from "zundo";
import { create, StoreApi } from "zustand";
import { useStoreWithEqualityFn } from "zustand/traditional";

type CreateResult<K> = ReturnType<typeof create<K, [["zustand/immer", never]]>> & {
  temporal: StoreApi<TemporalState<K>>;
};

export function useTemporalStore<K, T>(
  storeWithZundo: CreateResult<K>,
  selector: (state: TemporalState<K>) => T,
  equality?: (a: T, b: T) => boolean,
): T {
  return useStoreWithEqualityFn(storeWithZundo.temporal, selector, equality);
}
