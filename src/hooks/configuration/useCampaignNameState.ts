import { useEffect, useState } from "react";
import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import { checkCampaignNameValidity } from "@/services/campaignService";

export type CampaignNameStatus = "empty" | "checking" | "available" | "taken" | "unknown";

const NAME_CHECK_DELAY_MS = 500;

/**
 * The name is written to the store on every keystroke, so step validation never
 * depends on a manual "Validate" click. Availability is checked automatically
 * once typing pauses; the save path re-checks it before writing.
 */
export default function useCampaignNameState() {
  const { campaignName, setCampaignName, campaignId } = useCampaignConfigEdit((state) => state);
  const [status, setStatus] = useState<CampaignNameStatus>("empty");

  useEffect(() => {
    if (campaignName.trim().length === 0) {
      setStatus("empty");
      return;
    }

    setStatus("checking");
    let ignore = false;
    const timer = setTimeout(async () => {
      try {
        const isAvailable = await checkCampaignNameValidity(campaignName, campaignId);
        if (!ignore) setStatus(isAvailable ? "available" : "taken");
      } catch {
        if (!ignore) setStatus("unknown");
      }
    }, NAME_CHECK_DELAY_MS);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [campaignName, campaignId]);

  return { campaignName, setCampaignName, status };
}
