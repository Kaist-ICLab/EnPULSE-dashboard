import useCampaignConfigEdit from "../useCampaignConfigEdit";
import { deleteEntries, upsertCampaign } from "@/services/campaignService";
import { useCallback } from "react";
import { Campaign } from "@/types/campaign";
import bcryptjs from "bcryptjs";

export function useUpdateSensorConfig(onSuccess: (id: number) => void) {
    const { campaignId, campaignName, campaignDescription, campaignStartTime, campaignEndTime, campaignPassword, tables, surveys, removedEntries } = useCampaignConfigEdit();

    const updateSensorConfig = useCallback(() => {
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
                }

                const hash = await bcryptjs.hash(campaignPassword, 10);

                const upsertedCampaignId = await upsertCampaign(campaign, hash);
                await deleteEntries(removedEntries);
                onSuccess(upsertedCampaignId);
            } catch (error) {
                console.error(error);
            }
        }

        callback();
    }, [campaignId, campaignName, campaignDescription, campaignStartTime, campaignEndTime, campaignPassword, tables, surveys, removedEntries, onSuccess]);

    return { updateSensorConfig };
}