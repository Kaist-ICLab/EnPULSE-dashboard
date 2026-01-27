'use client';

import useCampaignConfigEdit from "@/hooks/useCampaignConfigEdit";
import useCampaign from "@/hooks/useCampaign";
import { useEffect } from "react";

const NewCampaignInitProvider: React.FC<{ children: React.ReactNode, isNewCampaign: boolean }> = ({ children, isNewCampaign }) => {
    const { campaign } = useCampaign();
    const { reset, setCampaign } = useCampaignConfigEdit();
    useEffect(() => {
        if (isNewCampaign) reset()
        else if (campaign) setCampaign({
            id: campaign.id,
            name: campaign.name,
            campaign_table: campaign.campaign_table,
            start_time_of_day: campaign.start_time_of_day,
            end_time_of_day: campaign.end_time_of_day,
            survey: campaign.survey,
        });
    }, [reset, setCampaign, campaign, isNewCampaign]);
    return <>{children}</>;
}
export default NewCampaignInitProvider;