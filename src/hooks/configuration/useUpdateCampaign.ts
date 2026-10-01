import { revalidateCampaigns } from "@/actions/revalidate";
import { useCampaignConfigEdit, useCampaignConfigEditStoreApi } from "@/providers/CampaignConfigEditStoreProvider";
import {
  checkCampaignNameValidity,
  deleteEntries,
  deleteRemovedTables,
  upsertCampaign,
} from "@/services/campaignService";
import { useCallback, useRef, useState } from "react";
import { Campaign } from "@/types/campaign";
import bcryptjs from "bcryptjs";
import { useTemporalStore } from "../useTemporalStore";
import { notify } from "@/utils/notify";

export function useUpdateCampaign(onSuccess: (id: number) => void | Promise<void>) {
  const {
    campaignId,
    campaignName,
    campaignDescription,
    campaignStartTime,
    campaignEndTime,
    campaignPassword,
    tables,
    surveys,
    campaign_trigger,
    webapps,
    removedEntries,
  } = useCampaignConfigEdit((state) => state);
  const { clear } = useTemporalStore(useCampaignConfigEditStoreApi(), (state) => state);
  const [isUpdating, setIsUpdating] = useState(false);
  // `isUpdating` only reaches the button after a re-render, so a fast double click
  // could start two saves (and create two campaigns). The ref blocks re-entry at once.
  const inFlightRef = useRef(false);

  const updateCampaignConfig = useCallback(() => {
    if (inFlightRef.current) return;

    const callback = async () => {
      let upsertedCampaignId: number;
      try {
        // The form checks availability while typing, but another campaign may have
        // taken the name since; campaigns.name has no unique constraint to catch it.
        const isNameAvailable = await checkCampaignNameValidity(campaignName, campaignId);
        if (!isNameAvailable) {
          notify.error(
            "Campaign name already in use",
            `Another campaign is already named "${campaignName}". Choose a different name under General.`,
          );
          return;
        }

        const campaign: Campaign = {
          id: campaignId,
          name: campaignName,
          description: campaignDescription,
          end_time: campaignEndTime,
          start_time: campaignStartTime,
          profiles: [],
          campaign_table: tables,
          survey: surveys,
          campaign_trigger,
          campaign_webapp: webapps,
        };

        const hash = campaignPassword.length > 0 ? await bcryptjs.hash(campaignPassword, 10) : null;

        await deleteRemovedTables(removedEntries);
        upsertedCampaignId = await upsertCampaign(campaign, hash);
        await deleteEntries(removedEntries);
        await revalidateCampaigns();
      } catch (error) {
        notify.error("Failed to save campaign", error instanceof Error ? error.message : "Unknown error");
        return;
      }

      notify.success("Campaign saved");
      // Awaited so the save stays "in flight" (Save disabled) until the caller has
      // finished refreshing its state from the database.
      await onSuccess(upsertedCampaignId);
    };

    inFlightRef.current = true;
    clear();
    setIsUpdating(true);
    callback().finally(() => {
      inFlightRef.current = false;
      setIsUpdating(false);
    });
  }, [
    campaignId,
    campaignName,
    campaignDescription,
    campaignStartTime,
    campaignEndTime,
    campaignPassword,
    tables,
    surveys,
    campaign_trigger,
    webapps,
    removedEntries,
    onSuccess,
    clear,
  ]);

  return { isUpdating, updateCampaignConfig };
}
