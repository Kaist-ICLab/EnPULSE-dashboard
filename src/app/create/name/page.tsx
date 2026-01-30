"use client"
import { Card } from "flowbite-react";
import CampaignName from "@/components/configuration/form/CampaignInfoForm";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PrevNextNavigation from "@/components/configuration/PrevNextNavigation";
import useCampaignConfigEdit from "@/hooks/useCampaignConfigEdit";

const Page: React.FC = () => {
    const { campaignName: campaignNameInHook } = useCampaignConfigEdit();
    const [campaignName, setCampaignName] = useState(campaignNameInHook);
    const [isValidName, setIsValidName] = useState(false);
    const router = useRouter();

    return (
        <>
            <Card>
                <CampaignName
                    campaignName={campaignName}
                    setCampaignName={setCampaignName}
                    setIsValidName={setIsValidName}
                />
            </Card>
            <PrevNextNavigation
                onPrevClick={() => router.push("/campaigns")}
                onNextClick={() => router.push("/create/passive-sensing")}
                nextLabel="Next"
                disabled={!isValidName}
            />
        </>
    );
}

export default Page;