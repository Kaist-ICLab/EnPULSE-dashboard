"use client"
import CampaignInfoForm from "@/components/configuration/form/CampaignInfoForm";
import CampaignPeriodForm from "@/components/configuration/form/CampaignPeriodForm";
import PrevNextNavigation from "@/components/configuration/PrevNextNavigation";
import { useValidConfigState } from "@/hooks/configuration/useValidConfigState";
import useCampaignConfigEdit from "@/hooks/useCampaignConfigEdit";
import { useTemporalStore } from "@/hooks/useTemporalStore";
import { useRouter } from "next/navigation";
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
            <CampaignInfoForm />
            <CampaignPeriodForm />
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