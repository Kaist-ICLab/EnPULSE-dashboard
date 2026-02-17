"use client"
import CampaignName from "@/components/configuration/form/CampaignInfoForm";
import { useRouter } from "next/navigation";
import PrevNextNavigation from "@/components/configuration/PrevNextNavigation";

const Page: React.FC = () => {
    const router = useRouter();

    return (
        <>
            <CampaignName
            />
            <PrevNextNavigation
                onPrevClick={() => router.push("/campaigns")}
                onNextClick={() => router.push("/create/passive-sensing")}
                nextLabel="Next"
            />
        </>
    );
}

export default Page;