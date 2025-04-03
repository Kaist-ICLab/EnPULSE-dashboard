import { create } from "zustand";
import { useEffect, useMemo } from "react";
import { useParams, useRouter, usePathname } from 'next/navigation';

export type Campaign = {
    id: number;
    name: string;
};

type CampaignState = {
    campaigns: Campaign[];
    campaignId: number;
    selectCampaign: (id: number) => void;
};

const useCampaignStore = create<CampaignState>((set) => ({
    campaigns: [
        { id: 0, name: "Campaign A" },
        { id: 1, name: "Campaign B" },
        { id: 2, name: "Campaign C" },
    ],
    campaignId: 0,
    selectCampaign: (id: number) => {
        set({ campaignId: id });
    },
}));


export const useCampaigns = () => {
    const params = useParams();
    // const router = useRouter();

    const campaigns = useCampaignStore((s) => s.campaigns);
    const campaignId = useCampaignStore((s) => s.campaignId);
    const setCampaignId = useCampaignStore((s) => s.selectCampaign);

    const currentCampaign = useMemo(() => {
        return campaigns.find((c) => c.id === campaignId) || { id: -1, name: "Unknown Campaign" };
      }, [campaigns, campaignId]);

    // ✅ 1. URL → state
    useEffect(() => {
        const idFromUrl = parseInt(params.id as string, 10);
        console.log(`URL ID: ${idFromUrl}`);
        if (!isNaN(idFromUrl)) {
            console.log("Setting campaignId from URL");
            setCampaignId(idFromUrl);
        }
    }, [params.id]);


    // ✅ State Change
    const selectCampaign = (id: number) => {
        setCampaignId(id);
    };

    return {
        campaigns,
        campaignId,
        currentCampaign,
        selectCampaign,
    };
};
export default useCampaigns;