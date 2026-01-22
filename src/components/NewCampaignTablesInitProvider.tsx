'use client';

import useNewCampaignTables from "@/hooks/create/useCampaignConfigEdit";
import { useEffect } from "react";

const NewCampaignInitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { reset } = useNewCampaignTables();
    useEffect(() => {
        reset();
    }, [reset]);
    return <>{children}</>;
}
export default NewCampaignInitProvider;