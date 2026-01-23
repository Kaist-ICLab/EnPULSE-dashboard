'use client';

import { useEffect } from "react";
import useCampaign from "@/hooks/useCampaign";

const CampaignInitProvider: React.FC<{ campaignId: number, campaigns: { id: number, name: string }[], children: React.ReactNode }> = ({ campaignId, campaigns, children }) => {
    const { selectCampaign, setCampaignList: setCampaigns } = useCampaign();
    useEffect(() => {
        setCampaigns(new Map(campaigns.map(campaign => [campaign.id, campaign.name])));
        selectCampaign(campaignId);
    }, []);
    return <>{children}</>;
}

export default CampaignInitProvider;