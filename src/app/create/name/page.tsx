"use client"
import CampaignName from "@/components/configuration/form/CampaignInfoForm";
import { useRouter } from "next/navigation";
import PrevNextNavigation from "@/components/configuration/PrevNextNavigation";
import { useValidConfigState } from "@/hooks/configuration/useValidConfigState";
import { useTemporalStore } from "@/hooks/useTemporalStore";
import useCampaignConfigEdit from "@/hooks/useCampaignConfigEdit";
import { useEffect } from "react";

const Page: React.FC = () => {
    const router = useRouter();
    const { isInfoValid } = useValidConfigState();

    const { clear } = useTemporalStore(useCampaignConfigEdit, (state) => state);

    useEffect(() => {
        clear();
    }, [clear]);

    return (
        <>
            <CampaignName
            />
            <PrevNextNavigation
                onPrevClick={() => router.push("/campaigns")}
                onNextClick={() => router.push("/create/passive-sensing")}
                nextLabel="Next"
                disabled={!isInfoValid}
            />
        </>
    );
}

export default Page;