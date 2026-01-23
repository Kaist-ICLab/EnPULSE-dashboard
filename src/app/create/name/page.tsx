"use client"
import { Card } from "flowbite-react";
import CampaignName from "@/components/configuration/form/CampaignNameForm";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PrevNextNavigation from "@/components/configuration/PrevNextNavigation";

const Page: React.FC = () => {
    const [campaignName, setCampaignName] = useState("");
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
            <div className="w-full gap-4 flex my-5">
                <PrevNextNavigation
                    onPrevClick={() => router.push("/campaigns")}
                    onNextClick={() => router.push("/create/active-sensing")}
                    nextLabel="Next"
                    disabled={!isValidName}
                />
            </div>
        </>
    );
}

export default Page;