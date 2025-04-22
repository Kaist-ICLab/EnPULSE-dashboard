import { create } from "zustand";
import { useCallback, useEffect, useMemo } from "react";
import { loadCampaignsFromServer } from "./loadCampaigns";

export type Campaign = {
    id: number;
    name: string;
};

type CampaignState = {
    campaigns: Campaign[];
    campaignId: number;
    selectCampaignId: (id: number) => void;
    selectCampaigns: (campaigns: Campaign[]) => void;
};

const useCampaignStore = create<CampaignState>((set) => ({
    campaigns: [],
    campaignId: 0,
    selectCampaignId: (id: number) => {
        set({ campaignId: id });
    },
    selectCampaigns: (campaigns: Campaign[]) => {
        set({ campaigns: campaigns });
    },
}));

export const useCampaigns = () => {
    const campaigns = useCampaignStore((s) => s.campaigns);
    const campaignId = useCampaignStore((s) => s.campaignId);
    const setCampaignId = useCampaignStore((s) => s.selectCampaignId);
    const setCampaigns = useCampaignStore((s) => s.selectCampaigns);

    const currentCampaign = useMemo(() => {
        return campaigns.find((c) => c.id === campaignId) || { id: -1, name: "Unknown Campaign" };
    }, [campaigns, campaignId]);

    const setCampaignValues = useCallback((campaignId: number, campaigns: Campaign[]) => {
        setCampaigns(campaigns);
        setCampaignId(campaignId);
    }, [setCampaignId, setCampaigns]);


    // ✅ 1. URL → state
    useEffect(() => {
        loadCampaignsFromServer().then(v => {
            setCampaignValues(v.some(c => c.id == campaignId) ? campaignId : v[0].id, v);
        });
    }, [setCampaignValues, campaignId]);


    // ✅ State Change
    const selectCampaign = (id: number) => {
        setCampaignId(id);
    };


    return {
        campaigns,
        campaignId,
        currentCampaign,
        selectCampaign,
        setCampaignValues,
    };
};
export default useCampaigns;