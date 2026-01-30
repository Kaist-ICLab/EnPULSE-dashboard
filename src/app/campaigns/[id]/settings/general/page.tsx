"use client"

import CampaignInfoForm from "@/components/configuration/form/CampaignInfoForm";
import useCampaignConfigEdit from "@/hooks/useCampaignConfigEdit";
import { useState } from "react";

const Page: React.FC = () => {
    const { campaignName: campaignNameInHook } = useCampaignConfigEdit();
    const [campaignName, setCampaignName] = useState(campaignNameInHook);

    return (
        <CampaignInfoForm
            campaignName={campaignName}
            setCampaignName={setCampaignName}
            setIsValidName={() => { }}
        />
    )
}

export default Page;