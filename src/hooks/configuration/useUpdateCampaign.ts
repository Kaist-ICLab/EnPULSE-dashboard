import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import { deleteEntries, upsertCampaign } from "@/services/campaignService";
import { useCallback } from "react";
import { Campaign } from "@/types/campaign";
import bcryptjs from "bcryptjs";

export function useUpdateCampaign(onSuccess: (id: number) => void) {
    const { campaignId, campaignName, campaignDescription, campaignStartTime, campaignEndTime, campaignPassword, tables, surveys, campaign_trigger, removedEntries } = useCampaignConfigEdit((state) => state);

    const updateCampaignConfig = useCallback(() => {
        const callback = async () => {
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
                }

                const hash = campaignPassword.length > 0 ? await bcryptjs.hash(campaignPassword, 10) : null;

                const upsertedCampaignId = await upsertCampaign(campaign, hash);
                await deleteEntries(removedEntries);
                onSuccess(upsertedCampaignId);
            } catch (error) {
                console.error(error);
            }
        }

        callback();
    }, [campaignId, campaignName, campaignDescription, campaignStartTime, campaignEndTime, campaignPassword, tables, surveys, campaign_trigger, removedEntries, onSuccess]);

    return { updateCampaignConfig };
}