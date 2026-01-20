import { ComparisonType, TimelineData } from "@/types/chart";
import { useEffect, useState } from "react";
import useCampaign from "../useCampaign";
import { getInterPersonData, getIntraPersonData, getTimelineOverviewData } from "@/services/chartService";
import { CampaignTableFieldWithTable } from "@/types/campaign";
import useSectionState from "../useSectionState";


export default function useTimeline(secitonType: ComparisonType, selectedFields: CampaignTableFieldWithTable[], chartWidth: number) {
    const [timeline, setTimeline] = useState<TimelineData[]>([]);
    const [bucketSize, setBucketSize] = useState<number>(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const { selectedCampaignId, campaignParticipants } = useCampaign();
    const { timelineParams, timeRange } = useSectionState()

    function getBucketSize(intervalInSec: number) {
        // unit: seconds
        const candidates = [
            0.001, 0.002, 0.005,       // 1ms, 2ms, 5ms
            0.01, 0.02, 0.05,          // 10ms, 20ms, 50ms
            0.1, 0.2, 0.5,             // 100ms, 200ms, 500ms
            1, 2, 5,                   // 1s, 2s, 5s
            10, 30,                // 10s, 20s
            60, 120, 300, 600,         // 1min ~ 10min
            1800, 3600, 7200, 14400,   // 30min ~ 4h
            86400                     // 1 day
        ];

        const nice = candidates.find(v => v >= intervalInSec) || 86400;
        return nice;
    }

    function getBucketString(bucketSize: number) {
        if (bucketSize < 1) return `${Math.round(bucketSize * 1000)} milliseconds`;
        if (bucketSize < 60) return `${bucketSize} seconds`;
        if (bucketSize < 3600) return `${bucketSize / 60} minutes`;
        return `${bucketSize / 3600} hours`;
    }

    useEffect(() => {
        if (!selectedCampaignId || !timelineParams.uuid || !timelineParams.date || !timelineParams.fieldId) return;

        const intervalInSec = (timeRange.end - timeRange.start) / 1000 / chartWidth; // seconds per pixel
        const pixelPerBucket = 10 // Change this value to change the bucket size
        const bucketSize = getBucketSize(intervalInSec * pixelPerBucket);
        const bucketString = getBucketString(bucketSize);

        setLoading(true);
        setError(null);

        async function fetchData() {
            let data: TimelineData[] = [];
            if (secitonType === ComparisonType.Sensors) {
                data = await getTimelineOverviewData(selectedFields, timelineParams, timeRange, bucketString);
            } else if (secitonType === ComparisonType.Participants) {
                data = await getInterPersonData(selectedFields, Array.from(campaignParticipants.values()), timelineParams, timeRange, bucketString);
            } else if (secitonType === ComparisonType.Days) {
                data = await getIntraPersonData(selectedFields, timelineParams, timeRange, bucketString);
            }

            setTimeline(data);
            setBucketSize(bucketSize * 1000);
            setLoading(false);
        }

        fetchData();
    }, [selectedCampaignId, timelineParams, timeRange, chartWidth, selectedFields, campaignParticipants, secitonType]);

    return { timeline, bucketSize, loading, error };
}   
