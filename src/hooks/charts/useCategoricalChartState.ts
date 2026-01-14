import { useMemo, useCallback } from "react";
import { formatTime } from "@/components/dashboard/charts/shared/timelineUtils";
import { TimelineCategoricalPoint } from "@/types/chart";

export function useCategoricalChartState(data: TimelineCategoricalPoint[], bucketSize: number) {
    // Calculate max stack value (sum of all counts for a timestamp)
    const maxValue = useMemo(() => {
        // For each timestamp, sum all counts from the value array
        if (data.length === 0) return 0;

        const maxAgg = Math.max(...data.map(d => Math.max(...d.value.map(v => v.aggregated))))
        return maxAgg || 0;
    }, [data]);

    const getTooltipData = useCallback((timeMs: number) => {
        // Find all data points for this timestamp
        const pointsAtTime = data.filter(d =>
            d.timestamp <= timeMs && timeMs <= d.timestamp + bucketSize
        );

        if (pointsAtTime.length === 0) return null;

        // Group by category and sum counts from all points at this time
        const categoryMap = new Map<string, number>();
        pointsAtTime.forEach(d => {
            d.value.forEach(item => {
                const current = categoryMap.get(item.category) || 0;
                categoryMap.set(item.category, current + item.count);
            });
        });

        const tooltipItems = Array.from(categoryMap.entries()).map(([category, count]) => ({
            label: category.toString(),
            value: count.toString(),
        }));

        return [
            {
                label: 'Time',
                value: `${formatTime(pointsAtTime[0].timestamp)} ~ ${formatTime(pointsAtTime[0].timestamp + bucketSize)}`,
            },
            ...tooltipItems
        ];
    }, [data, bucketSize]);

    return { maxValue, getTooltipData };
}
