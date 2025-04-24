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
    renameCampaign: (id: number, newName: string) => boolean;
    selectCampaignId: (id: number) => void;
    selectCampaigns: (campaigns: Campaign[]) => void;
};

const useCampaignStore = create<CampaignState>((set) => ({
    campaigns: [],
    campaignId: 0,
    selectCampaignId: (id: number) => {
        set({ campaignId: id });
        if (typeof window !== 'undefined') {
          localStorage.setItem('campaignId', id.toString());
        }
    },
    renameCampaign: (id: number, newName: string) => {
        set((state) => {
          const newState = {
            campaigns: state.campaigns.map((campaign) => 
                campaign.id === id ? { ...campaign, name: newName } : campaign
            )
          };
          
          // Save to localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('campaigns', JSON.stringify(newState.campaigns));
          }
          
          return newState;
        });
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

    const renameCampaign = (id: number, newName: string) => {
        return false;
        // set((state) => {
        //     const newState = {
        //         campaigns: state.campaigns.map((campaign) => 
        //             campaign.id === id ? { ...campaign, name: newName } : campaign
        //         )
        //     }
        // }
    }


    return {
        campaigns,
        campaignId,
        currentCampaign,
        selectCampaign,
        setCampaignValues,
        renameCampaign,
    };
};
export default useCampaigns;