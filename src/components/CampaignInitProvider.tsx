'use client';

import { useEffect } from "react";
import useCampaign from "@/hooks/useCampaign";

const CampaignInitProvider: React.FC<{ campaignId: number, campaigns: { id: number, name: string }[], children: React.ReactNode }> = ({ campaignId, campaigns, children }) => {
    const { selectCampaign, setCampaignList } = useCampaign();
    useEffect(() => {
        setCampaignList(new Map(campaigns.map(campaign => [campaign.id, campaign.name])));
        selectCampaign(campaignId);
    }, [campaignId, campaigns, selectCampaign, setCampaignList]);
    return <>{children}</>;
}

export default CampaignInitProvider;