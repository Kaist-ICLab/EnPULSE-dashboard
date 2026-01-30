import { useMemo, useCallback } from "react";
import { min, max } from "d3-array";
import { formatTime } from "@/utils/timelineUtils";
import { TimelineNumericalPoint } from "@/types/chart";

export function useNumericalPlotState(data: TimelineNumericalPoint[], bucketSize: number) {
    const { minValue, maxValue } = useMemo(() => {
        return {
            minValue: min(data, d => d.min) || 0,
            maxValue: max(data, d => d.max) || 0,
        }
    }, [data]);

    const getTooltipData = useCallback((timeMs: number) => {
        let tooltipDataPoint: TimelineNumericalPoint | null = null;

        for (const d of data) {
            if (d.timestamp <= timeMs && timeMs <= d.timestamp + bucketSize) {
                tooltipDataPoint = d;
                break;
            }
        }

        if (!tooltipDataPoint) return null;

        if (tooltipDataPoint.avg === tooltipDataPoint.min && tooltipDataPoint.avg === tooltipDataPoint.max) {
            return [{
                label: 'Time',
                value: `${formatTime(tooltipDataPoint.timestamp)} ~ ${formatTime(tooltipDataPoint.timestamp + bucketSize)}`,
            }, {
                label: 'Value',
                value: tooltipDataPoint.avg.toFixed(2),
            }]
        } else {
            return [{
                label: 'Time',
                value: `${formatTime(tooltipDataPoint.timestamp)} ~ ${formatTime(tooltipDataPoint.timestamp + bucketSize)}`,
            }, {
                label: 'Avg',
                value: tooltipDataPoint.avg.toFixed(2),
            }, {
                label: 'Min',
                value: tooltipDataPoint.min.toFixed(2),
            }, {
                label: 'Max',
                value: tooltipDataPoint.max.toFixed(2),
            }]
        }

    }, [data, bucketSize]);

    return { minValue, maxValue, getTooltipData };
}