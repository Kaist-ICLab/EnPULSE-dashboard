import { useCallback, useEffect, useState } from "react";
import { useCampaignStore } from "@/providers/CampaignStoreProvider";
import { getAuthAccountInfo } from "@/services/accountService";
import { getCampaignInfo } from "@/services/campaignService";
import { AuthAccountInfo, Participant } from "@/types/account";
import { notify } from "@/utils/notify";

const NO_PARTICIPANTS: Participant[] = [];

/** The campaign's participants, with sign-in details from Supabase Auth loaded alongside. */
export default function useParticipantAccounts() {
  const { campaign, setCampaign } = useCampaignStore((state) => state);
  const campaignId = campaign?.id;
  const [authInfo, setAuthInfo] = useState<Map<string, AuthAccountInfo> | null>(null);
  const [authInfoError, setAuthInfoError] = useState<string | null>(null);

  const loadAuthInfo = useCallback(async () => {
    try {
      setAuthInfo(await getAuthAccountInfo());
      setAuthInfoError(null);
    } catch (err) {
      setAuthInfoError(err instanceof Error ? err.message : "Unknown error");
    }
  }, []);

  useEffect(() => {
    loadAuthInfo();
  }, [loadAuthInfo]);

  // Reload the campaign as well, so added or deleted participants also show on the Dashboard.
  const reload = useCallback(async () => {
    if (campaignId !== undefined) {
      try {
        setCampaign(await getCampaignInfo(campaignId));
      } catch {
        notify.error("Failed to reload the campaign.", "Reload the page to see the latest participants.");
      }
    }
    await loadAuthInfo();
  }, [campaignId, setCampaign, loadAuthInfo]);

  return {
    participants: campaign?.profiles ?? NO_PARTICIPANTS,
    authInfo,
    isAuthInfoLoading: authInfo === null && authInfoError === null,
    authInfoError,
    reload,
  };
}
