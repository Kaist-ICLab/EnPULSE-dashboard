"use client"
import CampaignInfoForm from "@/components/configuration/form/CampaignInfoForm";
import CampaignPeriodForm from "@/components/configuration/form/CampaignPeriodForm";
import PrevNextNavigation from "@/components/configuration/PrevNextNavigation";
import { useValidConfigState } from "@/hooks/configuration/useValidConfigState";
import { useCampaignConfigEditStoreApi } from "@/providers/CampaignConfigEditStoreProvider";
import { useTemporalStore } from "@/hooks/useTemporalStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page: React.FC = () => {
    const router = useRouter();
    const { isInfoValid } = useValidConfigState();

    const configEditStore = useCampaignConfigEditStoreApi();
    const { clear } = useTemporalStore(configEditStore, (state) => state);

    useEffect(() => {
        clear();
    }, [clear]);

    return (
        <>
            <div className="flex flex-col gap-4">
                <CampaignInfoForm />
                <CampaignPeriodForm />
            </div>
            <PrevNextNavigation
                onNextClick={() => router.push("/create/passive-sensing")}
                nextLabel="Next"
                disabled={!isInfoValid}
            />
        </>
    );
}

export default Page;