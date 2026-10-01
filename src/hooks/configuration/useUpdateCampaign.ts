import { revalidateCampaigns } from "@/actions/revalidate";
import { useCampaignConfigEdit, useCampaignConfigEditStoreApi } from "@/providers/CampaignConfigEditStoreProvider";
import { deleteEntries, upsertCampaign } from "@/services/campaignService";
import { useCallback, useState } from "react";
import { Campaign } from "@/types/campaign";
import bcryptjs from "bcryptjs";
import { useTemporalStore } from "../useTemporalStore";
import { notify } from "@/utils/notify";

export function useUpdateCampaign(onSuccess: (id: number) => void) {
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

  const updateCampaignConfig = useCallback(() => {
    const callback = async () => {
      let upsertedCampaignId: number;
      try {
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

        upsertedCampaignId = await upsertCampaign(campaign, hash);
        await deleteEntries(removedEntries);
        await revalidateCampaigns();
      } catch (error) {
        notify.error("Failed to save campaign", error instanceof Error ? error.message : "Unknown error");
        return;
      }

      notify.success("Campaign saved");
      onSuccess(upsertedCampaignId);
    };

    clear();
    setIsUpdating(true);
    callback().finally(() => {
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
