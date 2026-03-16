"use client"
import PassiveSensingForm from "@/components/configuration/form/PassiveSensingForm";
import { useRouter } from "next/navigation";
import PrevNextNavigation from "@/components/configuration/PrevNextNavigation";
import { useValidConfigState } from "@/hooks/configuration/useValidConfigState";
import { useTemporalStore } from "@/hooks/useTemporalStore";
import useCampaignConfigEdit from "@/hooks/useCampaignConfigEdit";
import { useEffect } from "react";

const Page: React.FC = () => {
    const router = useRouter();
    const { isPassiveSensingValid } = useValidConfigState();

    const { clear } = useTemporalStore(useCampaignConfigEdit, (state) => state);

    useEffect(() => {
        clear();
    }, [clear]);

    return (
        <>
            <PassiveSensingForm />
            <PrevNextNavigation
                onNextClick={() => router.push("/create/active-sensing")}
                disabled={!isPassiveSensingValid}
            />
        </>
    );
}

export default Page;