"use client"
import { useRouter } from "next/navigation";

import PrevNextNavigation from "@/components/configuration/PrevNextNavigation";
import { useTemporalStore } from "@/hooks/useTemporalStore";
import { useCampaignConfigEditStoreApi } from "@/providers/CampaignConfigEditStoreProvider";
import { useEffect } from "react";

const CustomModulePage: React.FC = () => {
    const router = useRouter();
    const configEditStore = useCampaignConfigEditStoreApi();
    const { clear } = useTemporalStore(configEditStore, (state) => state);

    useEffect(() => {
        clear();
    }, [clear]);

    return (
        <>
            <PrevNextNavigation
                onNextClick={() => router.push("/create/triggers")}
                nextLabel="Next"
            />
        </>
    )
}

export default CustomModulePage;