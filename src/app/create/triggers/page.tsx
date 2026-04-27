"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import TriggerForm from "@/components/configuration/trigger/TriggerForm";
import PrevNextNavigation from "@/components/configuration/PrevNextNavigation";
import { useValidConfigState } from "@/hooks/configuration/useValidConfigState";
import { useTemporalStore } from "@/hooks/useTemporalStore";
import useCampaignConfigEdit from "@/hooks/useCampaignConfigEdit";

const Page: React.FC = () => {
    const router = useRouter();
    const { isTriggerValid } = useValidConfigState();
    const { clear } = useTemporalStore(useCampaignConfigEdit, (state) => state);

    useEffect(() => {
        clear();
    }, [clear]);

    return (
        <>
            <TriggerForm />
            <PrevNextNavigation
                onNextClick={() => router.push("/create/confirm")}
                disabled={!isTriggerValid}
            />
        </>
    );
}

export default Page;
