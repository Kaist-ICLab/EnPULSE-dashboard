import useCampaignConfigEdit from "../useCampaignConfigEdit";
import { upsertCampaign } from "@/services/campaignService";
import { useCallback, useState } from "react";
import { Campaign } from "@/types/campaign";

export function useUpdateSensorConfig() {
    const { campaignName, tables, surveys, passiveSensingConfig } = useCampaignConfigEdit();

    const [isSuccess, setIsSuccess] = useState(false);
    const [campaignId, setCampaignId] = useState<number | null>(null);

    const updateSensorConfig = useCallback(() => {
        const callback = async () => {
            try {
                const campaign: Campaign = {
                    name: campaignName,
                    end_time_of_day: passiveSensingConfig.endTime,
                    start_time_of_day: passiveSensingConfig.startTime,
                    profiles: [],
                    campaign_table: tables,
                    survey: surveys,
                }

                const campaignId = await upsertCampaign(campaign);
                setCampaignId(campaignId);
                setIsSuccess(true);

            } catch (error) {
                console.error(error);
                setIsSuccess(false);
                setCampaignId(null);
            }
        }

        callback();
    }, [campaignName, tables, surveys, passiveSensingConfig]);

    return { updateSensorConfig, isSuccess, campaignId, setIsSuccess, setCampaignId };
}