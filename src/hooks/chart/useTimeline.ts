import { TimelineData } from "@/types/chart";
import { ComparisonType } from "@/types/dashboard";
import { useEffect, useState, useMemo } from "react";
import { useCampaignStore } from "@/providers/CampaignStoreProvider";
import { getPersonComparisonData, getDaysComparisonData, getSensorComparisonData } from "@/services/chartService";
import useSectionState from "../useSectionState";


export default function useTimeline(secitonType: ComparisonType, chartWidth: number) {
    const [timeline, setTimeline] = useState<TimelineData[]>([]);
    const [bucketSize, setBucketSize] = useState<number>(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const { selectedCampaignId, campaignParticipants, campaignTables } = useCampaignStore((state) => state);
    const { date, comparisonParams, timeRange, lastManualSyncTime } = useSectionState()

    const currentComparisonParams = useMemo(() => comparisonParams[secitonType], [comparisonParams, secitonType])
    const selectedFields = useMemo(() => {
        return Array.from(campaignTables.values().map(table => ({
            ...table,
            campaign_table_field: table.campaign_table_field.filter(field => currentComparisonParams.fieldId.includes(field.id))
        }))).filter(table => table.campaign_table_field.length > 0)
    }, [currentComparisonParams, campaignTables])
    const selectedUuids = useMemo(() => currentComparisonParams.uuid.map(v => campaignParticipants.get(v)).filter(v => v !== undefined), [currentComparisonParams, campaignParticipants])

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
        if (!selectedCampaignId || !currentComparisonParams.uuid || !date || !currentComparisonParams.fieldId) return;

        const intervalInSec = (timeRange.end - timeRange.start) / 1000 / chartWidth; // seconds per pixel
        const pixelPerBucket = 10 // Change this value to change the bucket size
        const bucketSize = getBucketSize(intervalInSec * pixelPerBucket);
        const bucketString = getBucketString(bucketSize);

        setLoading(true);
        setError(null);

        async function fetchData() {
            let data: TimelineData[] = [];
            if (secitonType === ComparisonType.Sensors) {
                data = await getSensorComparisonData(date, selectedUuids[0], selectedFields, timeRange, bucketString);
            } else if (secitonType === ComparisonType.Participants) {
                data = await getPersonComparisonData(date, selectedUuids, selectedFields[0], timeRange, bucketString);
            } else if (secitonType === ComparisonType.Days) {
                data = await getDaysComparisonData(date, selectedUuids[0], selectedFields[0], timeRange, bucketString);
            }

            setTimeline(data);
            setBucketSize(bucketSize * 1000);
            setLoading(false);
        }

        fetchData();
    }, [selectedCampaignId, currentComparisonParams, timeRange, selectedFields, selectedUuids, secitonType, chartWidth, date, lastManualSyncTime]);

    return { timeline, bucketSize, loading, error };
}   
