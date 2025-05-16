'use client';

import { Campaign } from "@/types/campaign";
import { useEffect } from "react";
import useCampaign from "@/hooks/useCampaign";

const CampaignInitProvider: React.FC<{ campaignId: number, campaigns: Campaign[], children: React.ReactNode }> = ({ campaignId, campaigns, children }) => {
    const { selectCampaign, setCampaigns } = useCampaign();
    useEffect(() => {
        setCampaigns(new Map(campaigns.map(campaign => [campaign.id, campaign])));
        selectCampaign(campaignId);
    }, []);
    return <>{children}</>;
}

export default CampaignInitProvider;