"use client";

import { createContext, useContext, useState } from "react";
import { useStore } from "zustand";

import { type CampaignStore, createCampaignStore } from "@/stores/campaignStore";
import { FetchedCampaign } from "@/types/campaign";

export const CampaignStoreContext = createContext<ReturnType<typeof createCampaignStore> | undefined>(undefined);

export const CampaignStoreProvider: React.FC<{
  campaignId?: number;
  campaign?: FetchedCampaign;
  children: React.ReactNode;
}> = ({ campaignId, campaign, children }) => {
  const [store] = useState(() => createCampaignStore(campaignId, campaign));
  return <CampaignStoreContext.Provider value={store}>{children}</CampaignStoreContext.Provider>;
};

export const useCampaignStore = <T,>(selector: (state: CampaignStore) => T) => {
  const store = useContext(CampaignStoreContext);
  if (!store) {
    throw new Error("CampaignStoreContext not found");
  }

  return useStore(store, selector);
};

export default CampaignStoreProvider;
