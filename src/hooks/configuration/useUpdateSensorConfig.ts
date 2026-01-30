import useCampaignConfigEdit from "../useCampaignConfigEdit";
import { deleteEntries, upsertCampaign } from "@/services/campaignService";
import { useCallback } from "react";
import { Campaign } from "@/types/campaign";

export function useUpdateSensorConfig(onSuccess: (id: number) => void) {
    const { campaignId, campaignName, tables, surveys, passiveSensingConfig, removedEntries } = useCampaignConfigEdit();

    const updateSensorConfig = useCallback(() => {
        const callback = async () => {
            try {
                const campaign: Campaign = {
                    id: campaignId,
                    name: campaignName,
                    end_time_of_day: passiveSensingConfig.endTime,
                    start_time_of_day: passiveSensingConfig.startTime,
                    profiles: [],
                    campaign_table: tables,
                    survey: surveys,
                }

                const upsertedCampaignId = await upsertCampaign(campaign);
                await deleteEntries(removedEntries);
                onSuccess(upsertedCampaignId);
            } catch (error) {
                console.error(error);
            }
        }

        callback();
    }, [campaignId, campaignName, tables, surveys, passiveSensingConfig, removedEntries, onSuccess]);

    return { updateSensorConfig };
}