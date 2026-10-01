"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useStore } from "zustand";

import { type CampaignConfigEditStore, createCampaignConfigEditStore } from "@/stores/campaignConfigEditStore";
import { FetchedCampaign } from "@/types/campaign";
import { parseExportedCampaignConfig } from "@/utils/importedConfig";
import { notify } from "@/utils/notify";

type Store = ReturnType<typeof createCampaignConfigEditStore>;

export const CampaignConfigEditStoreContext = createContext<Store | undefined>(undefined);

export const CampaignConfigEditStoreProvider: React.FC<{
  campaign?: FetchedCampaign;
  isNewCampaign?: boolean;
  children: React.ReactNode;
}> = ({ campaign, isNewCampaign, children }) => {
  const [store] = useState(() => createCampaignConfigEditStore(campaign));
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    if (isNewCampaign) {
      const pendingRawConfig = sessionStorage.getItem(process.env.NEXT_PUBLIC_PENDING_IMPORTED_CONFIG_KEY ?? "");
      sessionStorage.removeItem(process.env.NEXT_PUBLIC_PENDING_IMPORTED_CONFIG_KEY ?? "");

      if (pendingRawConfig) {
        try {
          const parsed = parseExportedCampaignConfig(pendingRawConfig);
          store.getState().setCampaignUsingImportedConfig(parsed);
        } catch (error) {
          notify.error("Failed to initialize imported configuration.", error instanceof Error ? error.message : "");
        }
      }
    }

    store.temporal.getState().clear();
  }, [store, isNewCampaign]);

  return <CampaignConfigEditStoreContext.Provider value={store}>{children}</CampaignConfigEditStoreContext.Provider>;
};

export const useCampaignConfigEditStoreApi = () => {
  const store = useContext(CampaignConfigEditStoreContext);
  if (!store) {
    throw new Error("CampaignConfigEditStoreContext not found");
  }
  return store;
};

export const useCampaignConfigEdit = <T,>(selector: (state: CampaignConfigEditStore) => T): T => {
  const store = useCampaignConfigEditStoreApi();
  return useStore(store, selector);
};

export default CampaignConfigEditStoreProvider;
