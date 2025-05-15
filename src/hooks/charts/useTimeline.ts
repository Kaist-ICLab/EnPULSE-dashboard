import { ChartParams, ChartType, TimelineData } from "@/types/chart";
import { useEffect, useState } from "react";
import useCampaign from "../useCampaign";
import { getInterPersonData, getIntraPersonData, getTimelineOverviewData } from "@/services/chartService";
import { CampaignTableFieldWithTable } from "@/types/campaign";


export default function useTimeline(params: ChartParams, type: ChartType, selectedFields: CampaignTableFieldWithTable[], chartWidth: number, timeRange: { start: number, end: number }) {
    const [timeline, setTimeline] = useState<TimelineData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const { selectedCampaignId, campaignParticipants } = useCampaign();

    function getBucketSize(intervalInSec: number): string {
        // unit: seconds
        const candidates = [
            0.001, 0.002, 0.005,       // 1ms, 2ms, 5ms
            0.01, 0.02, 0.05,          // 10ms, 20ms, 50ms
            0.1, 0.2, 0.5,             // 100ms, 200ms, 500ms
            1, 2, 5,                   // 1s, 2s, 5s
            10, 15, 30,                // 10s, 15s, 30s
            60, 120, 300, 600,         // 1min ~ 10min
            1800, 3600, 7200, 14400,   // 30min ~ 4h
            86400                     // 1 day
        ];

        const nice = candidates.find(v => v >= intervalInSec) || 86400;

        if (nice < 1) return `${Math.round(nice * 1000)} milliseconds`;
        if (nice < 60) return `${nice} seconds`;
        if (nice < 3600) return `${nice / 60} minutes`;
        return `${nice / 3600} hours`;
    }

    useEffect(() => {
        const { uuid, date, fieldId } = params;
        if (!selectedCampaignId || !uuid || !date || !fieldId) return;

        const intervalInSec = (timeRange.end - timeRange.start) / 1000 / chartWidth; // seconds per pixel
        const k = 3 // Change this value to change the bucket size
        const bucketSize = getBucketSize(intervalInSec * k);

        setLoading(true);
        setError(null);

        // async function fetchData() {
        //     let data: TimelineData[] = [];
        //     if (type === ChartType.TimelineOverview) {
        //         data = await getTimelineOverviewData(selectedFields, params, timeRange, bucketSize);
        //     } else if (type === ChartType.InterPerson) {
        //         data = await getInterPersonData(selectedFields, Array.from(campaignParticipants.values()), params);
        //     } else if (type === ChartType.IntraPerson) {
        //         data = await getIntraPersonData(selectedFields, params);
        //     }

        //     setTimeline(data);
        //     setLoading(false);
        // }

        // fetchData();
        console.log('fetch')
    }, [selectedCampaignId, params, selectedFields, campaignParticipants, type, timeRange, chartWidth]);

    return { timeline, loading, error };
}   
