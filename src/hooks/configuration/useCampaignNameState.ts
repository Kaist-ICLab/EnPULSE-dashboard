import { useCallback, useEffect, useState } from "react";
import useCampaignConfigEdit from "../useCampaignConfigEdit";
import { checkCampaignNameValidity } from "@/services/campaignService";

export default function useCampaignNameState() {
    const { campaignName: campaignNameInHook, setCampaignName: setCampaignNameInHook, campaignId } = useCampaignConfigEdit();
    const [campaignName, _setCampaignName] = useState(campaignNameInHook);
    const [status, setStatus] = useState<"loading" | "ok" | "error" | null>(null);
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        _setCampaignName(campaignNameInHook);
    }, [campaignNameInHook, _setCampaignName]);

    const setCampaignName = useCallback((name: string) => {
        _setCampaignName(name);
        setIsChanged(true);
    }, []);

    const checkIsValidName = useCallback(async () => {
        setStatus("loading");
        const isValid = await checkCampaignNameValidity(campaignName, campaignId);
        setStatus(isValid ? "ok" : "error");
        setIsChanged(false);

        if (isValid) setCampaignNameInHook(campaignName);
    }, [campaignName, setCampaignNameInHook, campaignId]);

    return { campaignName, setCampaignName, status, isChanged, checkIsValidName };
}