import { ChartParams, ChartType, TimelineData } from "@/types/chart";
import { useEffect, useState } from "react";
import useCampaign from "../useCampaign";
import { getInterPersonData, getIntraPersonData, getTimelineOverviewData } from "@/services/chartService";


export default function useTimeline(params: ChartParams, type: ChartType) {
    const [timeline, setTimeline] = useState<TimelineData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const { mergedTabledFields, selectedCampaignId, campaignParticipants } = useCampaign();
    useEffect(() => {
        const { uuid, date, fieldId } = params;
        if (!selectedCampaignId || !uuid || !date || !fieldId) return;

        setLoading(true);
        setError(null);

        async function fetchData() {
            let data: TimelineData[] = [];
            if (type === ChartType.TimelineOverview) {
                data = await getTimelineOverviewData(mergedTabledFields, params);
            } else if (type === ChartType.InterPerson) {
                data = await getInterPersonData(mergedTabledFields, Array.from(campaignParticipants.values()), params);
            } else if (type === ChartType.IntraPerson) {
                data = await getIntraPersonData(mergedTabledFields, params);
            }

            setTimeline(data);
            setLoading(false);
        }

        fetchData();
    }, [selectedCampaignId, params, mergedTabledFields, campaignParticipants, type]);

    return { timeline, loading, error };
}   
