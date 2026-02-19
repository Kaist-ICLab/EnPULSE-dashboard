import useCampaignConfigEdit from "../useCampaignConfigEdit";
import { useMemo } from "react";

export function useValidConfigState() {
    const { campaignName, campaignPassword } = useCampaignConfigEdit();

    const isInfoValid = useMemo(() => {
        return campaignName.length > 0 && campaignPassword.length > 0;
    }, [campaignName, campaignPassword]);

    const isPassiveSensingValid = true

    const isActiveSensingValid = true

    const isAccessible = useMemo(() => {
        const isAccessible = [true]
        for (const isValid of [isInfoValid, isPassiveSensingValid, isActiveSensingValid]) {
            isAccessible.push(isAccessible[isAccessible.length - 1] && isValid);
        }

        return isAccessible;
    }, [isInfoValid, isPassiveSensingValid, isActiveSensingValid]);

    return { isInfoValid, isPassiveSensingValid, isActiveSensingValid, isAccessible };
}