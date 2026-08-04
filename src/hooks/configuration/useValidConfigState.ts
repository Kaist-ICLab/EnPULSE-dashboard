import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import { useMemo } from "react";
import { isTriggerComplete } from "@/types/trigger";

export function useValidConfigState() {
    const { campaignName, campaignPassword, campaign_trigger, webapps } = useCampaignConfigEdit((state) => state);

    const isInfoValid = useMemo(() => {
        return campaignName.length > 0 && campaignPassword.length > 0;
    }, [campaignName, campaignPassword]);

    const isPassiveSensingValid = true

    const isActiveSensingValid = true

    const isWebappValid = useMemo(() => {
        return webapps.every((webapp) => !!webapp.icon_url);
    }, [webapps]);

    const isTriggerValid = useMemo(() => {
        return campaign_trigger.every(isTriggerComplete);
    }, [campaign_trigger]);

    const isAccessible = useMemo(() => {
        const isAccessible = [true]
        for (const isValid of [isInfoValid, isPassiveSensingValid, isActiveSensingValid, isWebappValid, isTriggerValid]) {
            isAccessible.push(isAccessible[isAccessible.length - 1] && isValid);
        }

        return isAccessible;
    }, [isInfoValid, isPassiveSensingValid, isActiveSensingValid, isWebappValid, isTriggerValid]);

    return { isInfoValid, isPassiveSensingValid, isActiveSensingValid, isWebappValid, isTriggerValid, isAccessible };
}