'use client';

import useCampaign from "@/hooks/useCampaign";
import useCampaignConfigEdit from "@/hooks/useCampaignConfigEdit";
import { useTemporalStore } from "@/hooks/useTemporalStore";
import { useEffect, useRef } from "react";

const ConfigEditInitProvider: React.FC<{
    children: React.ReactNode,
    isNewCampaign: boolean,
}> = ({ children, isNewCampaign }) => {
    const { campaign } = useCampaign();
    const { reset, setCampaign, setCampaignUsingImportedConfig } = useCampaignConfigEdit();
    const { clear } = useTemporalStore(useCampaignConfigEdit, (state) => state);
    const isInitializedRef = useRef(false);

    useEffect(() => {
        if (isInitializedRef.current) return;


        if (isNewCampaign) {
            reset();

            const pendingRawConfig = sessionStorage.getItem(process.env.NEXT_PUBLIC_PENDING_IMPORTED_CONFIG_KEY ?? "");
            sessionStorage.removeItem(process.env.NEXT_PUBLIC_PENDING_IMPORTED_CONFIG_KEY ?? "");

            if (pendingRawConfig) {
                try {
                    const parsed = JSON.parse(pendingRawConfig);
                    setCampaignUsingImportedConfig(parsed);
                } catch {
                    window.alert("Failed to initialize imported configuration.");
                }
            }

            isInitializedRef.current = true;
        }
        else if (campaign) {
            setCampaign(campaign);
            isInitializedRef.current = true;
        }

        clear();
    }, [reset, setCampaign, campaign, isNewCampaign, clear, setCampaignUsingImportedConfig]);

    return <>{children}</>;
}
export default ConfigEditInitProvider;