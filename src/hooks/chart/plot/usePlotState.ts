import useSectionState from "@/hooks/useSectionState";
import { useMemo, useEffect, useCallback } from "react";
import { TimelineCategoricalPoint, TimelineNumericalPoint } from "@/types/chart";
import { ChartType } from "@/types/chart";
import { useTooltip } from "@visx/tooltip";
import { scaleTime } from "@visx/scale";
import { scaleLinear } from "@visx/scale";
import { TooltipData } from "@/types/chart";
import { useVaryingPlotState } from "./useVaryingPlotState";

export function usePlotState(
    data: (TimelineNumericalPoint | TimelineCategoricalPoint)[],
    chartType: ChartType,
    bucketSize: number,
    baseTime: number,
    svgRef: React.RefObject<SVGSVGElement | null>,
    width: number,
    height: number,
    fieldId: number,
) {
    const { timeRange, draggedTime, updateTimeRange, initTimeRange } = useSectionState();
    const { minValue, maxValue, getTooltipData } = useVaryingPlotState(data, chartType, bucketSize, fieldId);
    const currentTimeRange = useMemo(() => {
        return { start: timeRange.start + draggedTime, end: timeRange.end + draggedTime };
    }, [timeRange, draggedTime]);

    const {
        tooltipData,
        tooltipLeft,
        tooltipTop,
        tooltipOpen,
        showTooltip,
        hideTooltip,
    } = useTooltip<TooltipData>();

    useEffect(() => {
        initTimeRange();
    }, [initTimeRange]);

    // Time scale
    const timeScale = useMemo(() => {
        const rangeStart = baseTime + currentTimeRange.start;
        const rangeEnd = baseTime + currentTimeRange.end;

        return scaleTime({
            domain: [rangeStart, rangeEnd],
            range: [0, width],
        });
    }, [baseTime, currentTimeRange, width]);

    // Value scale
    const valueScale = useMemo(() => {
        if (data.length === 0 || height <= 0) {
            return scaleLinear({
                domain: [0, 1],
                range: [height || 1, 0],
            });
        }

        return scaleLinear({
            domain: [minValue, maxValue],
            range: [height * 0.95, chartType === 'numerical' ? height * 0.05 : 0],
            nice: true,
        });
    }, [data.length, minValue, maxValue, height, chartType]);

    // Bar width calculation
    const barWidth = useMemo(() => {
        if (data.length === 0) return 0;

        const bucketCount = (currentTimeRange.end - currentTimeRange.start) / bucketSize;
        const bucketWidth = width / bucketCount;

        return bucketWidth;
    }, [data.length, bucketSize, width, currentTimeRange]);

    // Handle brush end (zoom)
    const handleBrushChange = useCallback((bounds: { x0: number, x1: number } | null) => {
        if (bounds === null) return;

        const brushStart = Math.floor(bounds.x0 / bucketSize) * bucketSize;
        const brushEnd = Math.ceil(bounds.x1 / bucketSize) * bucketSize;

        updateTimeRange({
            start: brushStart - baseTime,
            end: brushEnd - baseTime,
        });
    }, [baseTime, updateTimeRange, bucketSize]);

    // Handle mouse move for tooltip
    const handleMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
        if (!svgRef.current || data.length === 0) return;

        const svgRect = svgRef.current.getBoundingClientRect();
        const x = event.clientX - svgRect.left;
        const time = timeScale.invert(x);
        if (!time) return;

        const timeMs = time.getTime();
        const tooltipData = getTooltipData(timeMs);

        if (tooltipData == null) {
            hideTooltip();
            return;
        }

        // Constrain tooltip position within chart container bounds
        const tooltipWidth = 200; // Approximate tooltip width
        const tooltipHeight = 100; // Approximate tooltip height
        const padding = 10; // Padding from edges

        let tooltipLeft = event.clientX;
        let tooltipTop = event.clientY;

        // Constrain horizontally
        if (tooltipLeft + tooltipWidth > svgRect.right - padding) {
            tooltipLeft = svgRect.right - tooltipWidth - padding;
        }
        if (tooltipLeft < svgRect.left + padding) {
            tooltipLeft = svgRect.left + padding;
        }

        // Constrain vertically
        if (tooltipTop + tooltipHeight > svgRect.bottom - padding) {
            tooltipTop = svgRect.bottom - tooltipHeight - padding;
        }
        if (tooltipTop < svgRect.top + padding) {
            tooltipTop = svgRect.top + padding;
        }

        showTooltip({
            tooltipLeft: tooltipLeft - svgRect.left,
            tooltipTop: tooltipTop - svgRect.top,
            tooltipData
        });
    }, [getTooltipData, timeScale, hideTooltip, showTooltip, data.length, svgRef]);

    const handleDoubleClick = useCallback(() => {
        initTimeRange();
    }, [initTimeRange]);

    return {
        tooltipData,
        tooltipLeft,
        tooltipTop,
        tooltipOpen,
        handleMouseMove,
        handleDoubleClick,
        handleBrushChange,
        barWidth,
        timeScale,
        valueScale,
        hideTooltip,
    }
}