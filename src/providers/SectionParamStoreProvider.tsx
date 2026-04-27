'use client';

import { createContext, useContext, useState } from "react";
import { useStore } from "zustand";

import { type SectionParamStore, createSectionParamStore } from "@/stores/sectionParamStore";
import { FetchedCampaign } from "@/types/campaign";

export const SectionParamStoreContext = createContext<ReturnType<typeof createSectionParamStore> | undefined>(undefined)

export const SectionParamStoreProvider: React.FC<{
    campaign?: FetchedCampaign,
    children: React.ReactNode
}> = ({ campaign, children }) => {
    const [store] = useState(() => createSectionParamStore(campaign))
    return <SectionParamStoreContext.Provider value={store}>{children}</SectionParamStoreContext.Provider>;
}

export const useSectionParamStore = <T,>(selector: (state: SectionParamStore) => T) => {
    const store = useContext(SectionParamStoreContext);
    if (!store) {
        throw new Error("SectionParamStoreContext not found");
    }

    return useStore(store, selector);
}

export default SectionParamStoreProvider;
