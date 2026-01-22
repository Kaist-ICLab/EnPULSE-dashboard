"use client"
import { Button, Card } from "flowbite-react";
import CampaignName from "@/components/create/Form/CampaignNameForm";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
                <Button className="grow" size="lg" color="gray" onClick={() => router.push("/campaigns")}>
                    Cancel
                </Button>
                <Button className="grow" size="lg" disabled={!isValidName} onClick={() => router.push("/create/active-sensing")}>
                    Next
                </Button>
            </div>
        </>
    );
}

export default Page;