"use client"

import { Card } from "flowbite-react";
import CampaignInfoForm from "@/components/configuration/form/CampaignInfoForm";
import useCampaignConfigEdit from "@/hooks/useCampaignConfigEdit";
import { useState } from "react";

const Page: React.FC = () => {
    const { campaignName: campaignNameInHook } = useCampaignConfigEdit();
    const [campaignName, setCampaignName] = useState(campaignNameInHook);

    return (
        <Card>
            <CampaignInfoForm
                campaignName={campaignName}
                setCampaignName={setCampaignName}
                setIsValidName={() => { }}
            />
        </Card>
    )
}

export default Page;