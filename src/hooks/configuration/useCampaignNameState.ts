import { useCallback, useEffect, useState } from "react";
import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import { checkCampaignNameValidity } from "@/services/campaignService";
import { notify } from "@/utils/notify";

export default function useCampaignNameState() {
    const { campaignName: campaignNameInHook, setCampaignName: setCampaignNameInHook, campaignId } = useCampaignConfigEdit((state) => state);
    const [campaignName, setCampaignName] = useState(campaignNameInHook);
    const [status, setStatus] = useState<"loading" | "ok" | "error" | null>(null);
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        setCampaignName(campaignNameInHook);
    }, [campaignNameInHook, setCampaignName]);

    useEffect(() => {
        setIsChanged(true)
    }, [campaignName])

    // const setCampaignName = useCallback((name: string) => {
    //     _setCampaignName(name);
    //     setIsChanged(true);
    // }, []);

    const checkIsValidName = useCallback(async () => {
        setStatus("loading");
        try {
            const isValid = await checkCampaignNameValidity(campaignName, campaignId);
            setStatus(isValid ? "ok" : "error");
            setIsChanged(false);

            if (isValid) setCampaignNameInHook(campaignName);
        } catch {
            notify.error("Failed to validate campaign name.");
            setStatus(null);
            setIsChanged(false);
        }
    }, [campaignName, setCampaignNameInHook, campaignId]);

    return { campaignName, setCampaignName, status, isChanged, checkIsValidName };
}