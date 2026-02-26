"use client"

import ActiveSensingForm from "@/components/configuration/form/ActiveSensingForm";
import { usePathname } from "next/navigation";
import useCampaign from "@/hooks/useCampaign";
import useCampaignConfigEdit from "@/hooks/useCampaignConfigEdit";
import { useEffect } from "react";
import { useTemporalStore } from "@/hooks/useTemporalStore";

const Page: React.FC = () => {
    const pathname = usePathname();
    const { campaign } = useCampaign();
    const { setCampaign } = useCampaignConfigEdit();

    const { clear } = useTemporalStore(useCampaignConfigEdit, (state) => state);

    useEffect(() => {
        if (campaign) setCampaign(campaign);
        clear();
    }, [campaign, setCampaign, clear]);

    return <ActiveSensingForm baseUrl={pathname} />
}

export default Page;