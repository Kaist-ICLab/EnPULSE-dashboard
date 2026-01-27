"use client"

import { Card } from "flowbite-react";
import CampaignName from "@/components/configuration/form/CampaignNameForm";
import useCampaignConfigEdit from "@/hooks/useCampaignConfigEdit";
import { useState } from "react";

const Page: React.FC = () => {
    const { campaignName: campaignNameInHook } = useCampaignConfigEdit();
    const [campaignName, setCampaignName] = useState(campaignNameInHook);

    return (
        <Card>
            <CampaignName
                campaignName={campaignName}
                setCampaignName={setCampaignName}
                setIsValidName={() => { }}
            />
        </Card>
    )
}

export default Page;