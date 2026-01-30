'use client';

import useCampaignConfigEdit from "@/hooks/useCampaignConfigEdit";
import useCampaign from "@/hooks/useCampaign";
import { useEffect } from "react";

const NewCampaignInitProvider: React.FC<{ children: React.ReactNode, isNewCampaign: boolean }> = ({ children, isNewCampaign }) => {
    const { campaign } = useCampaign();
    const { reset, setCampaign } = useCampaignConfigEdit();
    useEffect(() => {
        if (isNewCampaign) reset()
        else if (campaign) setCampaign(campaign);
    }, [reset, setCampaign, campaign, isNewCampaign]);
    return <>{children}</>;
}
export default NewCampaignInitProvider;