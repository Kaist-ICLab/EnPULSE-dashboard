'use client';

import { useEffect } from "react";
import useCampaign from "@/hooks/useCampaign";

const CampaignInitProvider: React.FC<{ campaignId: number, campaigns: { id: number, name: string, description: string, start_time: string, end_time: string }[], children: React.ReactNode }> = ({ campaignId, campaigns, children }) => {
    const { selectCampaign, setCampaignList } = useCampaign();
    useEffect(() => {
        setCampaignList(new Map(campaigns.map(({ id, ...others }) => [id, { ...others }])));
        selectCampaign(campaignId);
    }, [campaignId, campaigns, selectCampaign, setCampaignList]);
    return <>{children}</>;
}

export default CampaignInitProvider;