'use client';

import useCampaignConfigEdit from "@/hooks/useCampaignConfigEdit";
import useCampaign from "@/hooks/useCampaign";
import { useEffect } from "react";
import { useTemporalStore } from "@/hooks/useTemporalStore";

const NewCampaignInitProvider: React.FC<{ children: React.ReactNode, isNewCampaign: boolean }> = ({ children, isNewCampaign }) => {
    const { campaign } = useCampaign();
    const { reset, setCampaign } = useCampaignConfigEdit();
    const { clear } = useTemporalStore(useCampaignConfigEdit, (state) => state);

    useEffect(() => {
        if (isNewCampaign) reset();
        else if (campaign) setCampaign(campaign);
        clear();
    }, [reset, setCampaign, campaign, isNewCampaign, clear]);

    return <>{children}</>;
}
export default NewCampaignInitProvider;