import { SectionType, TimelineData } from "@/types/chart";
import { useEffect, useMemo, useState } from "react";
import useCampaign from "../useCampaign";
import { getInterPersonData, getIntraPersonData, getTimelineOverviewData } from "@/services/chartService";
import { CampaignTableFieldWithTable } from "@/types/campaign";
import useSectionState from "./useSectionState";


export default function useTimeline(type: SectionType, selectedFields: CampaignTableFieldWithTable[], chartWidth: number) {
    console.log('useTimeline', type)
    const [timeline, setTimeline] = useState<TimelineData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const { selectedCampaignId, campaignParticipants } = useCampaign();
    const { sectionParams, timeRange } = useSectionState()

    const currentSectionParams = useMemo(() => sectionParams[type], [sectionParams, type])
    const currentTimeRange = useMemo(() => timeRange[type], [timeRange, type])

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
        const { uuid, date, fieldId } = currentSectionParams;
        if (!selectedCampaignId || !uuid || !date || !fieldId) return;

        const intervalInSec = (currentTimeRange.end - currentTimeRange.start) / 1000 / chartWidth; // seconds per pixel
        const pixelPerBucket = 5 // Change this value to change the bucket size
        const bucketSize = getBucketSize(intervalInSec * pixelPerBucket);

        setLoading(true);
        setError(null);

        async function fetchData() {
            let data: TimelineData[] = [];
            if (type === SectionType.TimelineOverview) {
                data = await getTimelineOverviewData(selectedFields, currentSectionParams, currentTimeRange, bucketSize);
            } else if (type === SectionType.InterPerson) {
                data = await getInterPersonData(selectedFields, Array.from(campaignParticipants.values()), currentSectionParams);
            } else if (type === SectionType.IntraPerson) {
                data = await getIntraPersonData(selectedFields, currentSectionParams);
            }

            setTimeline(data);
            setLoading(false);
        }

        fetchData();
    }, [selectedCampaignId, currentSectionParams, selectedFields, campaignParticipants, type, currentTimeRange, chartWidth]);

    return { timeline, loading, error };
}   
