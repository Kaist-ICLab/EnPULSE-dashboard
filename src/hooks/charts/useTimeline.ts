import { ChartParams, ChartType, TimelineData } from "@/types/chart";
import { useEffect, useState } from "react";
import useCampaign from "../useCampaign";
import { getTimelineOverviewData } from "@/services/chartService";


export default function useTimeline(params: ChartParams, type: ChartType) {
    const [timeline, setTimeline] = useState<TimelineData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const { mergedTabledFields, selectedCampaignId } = useCampaign();
    useEffect(() => {
        const { uuid, date, fieldId } = params;
        if (!selectedCampaignId || !uuid || !date || !fieldId) return;

        setLoading(true);
        setError(null);

        async function fetchData() {
            const data = await getTimelineOverviewData(mergedTabledFields, params);
            setTimeline(data);
            setLoading(false);
        }

        fetchData();
    }, [selectedCampaignId, params, mergedTabledFields]);

    return { timeline, loading, error };
}   
