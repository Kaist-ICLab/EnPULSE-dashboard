import { useMemo, useCallback } from "react";
import { formatTime, colors } from "@/utils/timelineUtils";
import { TimelineCategoricalPoint } from "@/types/chart";
import useCampaign from "@/hooks/useCampaign";

export function useBarcodePlotState(data: TimelineCategoricalPoint[], bucketSize: number, fieldId: number) {
    const { campaignTableFieldMapping } = useCampaign();

    const mapping = useMemo(() => {
        return campaignTableFieldMapping.get(fieldId);
    }, [campaignTableFieldMapping, fieldId]);

    const maxTotalCount = useMemo(() => {
        return Math.max(
            ...data.map(point =>
                point.value.reduce((sum, item) => sum + item.count, 0)
            ),
            1 // Ensure at least 1 to avoid division by zero
        );
    }, [data]);

    const getColor = useCallback((point: TimelineCategoricalPoint) => {
        const totalCount = point.value.reduce((sum, item) => sum + item.count, 0);

        // Calculate opacity based on total count (normalized to 0.3 - 1.0 range)
        const opacity = Math.max(0.2, Math.min(1.0, 0.2 + (totalCount / maxTotalCount) * 0.7));

        return {
            color: colors[0],
            opacity: opacity
        };
    }, [maxTotalCount]);

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

        let tooltipItems;
        if (categoryMap.size === 1 && categoryMap.entries().next().value?.[1] === 1) {
            tooltipItems = Array.from(categoryMap.entries()).map(([category,]) => ({
                label: 'Value',
                value: mapping?.get(category) ?? category.toString()
            }));
        } else {
            const count = Array.from(categoryMap.values()).reduce((acc, curr) => acc + curr, 0);
            tooltipItems = [{
                label: 'Count',
                value: count.toString(),
            }];
        }

        return [
            {
                label: 'Time',
                value: `${formatTime(pointsAtTime[0].timestamp)} ~ ${formatTime(pointsAtTime[0].timestamp + bucketSize)}`,
            },
            ...tooltipItems
        ];
    }, [data, bucketSize, mapping]);

    return { getTooltipData, getColor };
}
