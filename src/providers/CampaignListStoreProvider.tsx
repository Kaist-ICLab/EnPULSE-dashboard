"use client";

import { createContext, useContext, useState } from "react";
import { useStore } from "zustand";

import { type CampaignListStore, createCampaignListStore } from "@/stores/campaignListStore";
import { CampaignListItem } from "@/types/campaign";

export const CampaignListStoreContext = createContext<ReturnType<typeof createCampaignListStore> | undefined>(
  undefined,
);

export const CampaignListStoreProvider: React.FC<{
  campaignList: Map<number, CampaignListItem>;
  children: React.ReactNode;
}> = ({ campaignList, children }) => {
  const [store] = useState(() => createCampaignListStore(campaignList));
  return <CampaignListStoreContext.Provider value={store}>{children}</CampaignListStoreContext.Provider>;
};

export const useCampaignListStore = <T,>(selector: (state: CampaignListStore) => T) => {
  const store = useContext(CampaignListStoreContext);
  if (!store) {
    throw new Error("CampaignListStoreContext not found");
  }

  return useStore(store, selector);
};

export default CampaignListStoreProvider;
