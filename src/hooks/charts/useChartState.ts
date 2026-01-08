import useSectionState from "../useSectionState";
import { useMemo, useEffect, useCallback } from "react";
import { SectionType, TimelineCategoricalPoint, TimelineNumericalPoint } from "@/types/chart";
import { ChartType } from "@/types/chart";
import { useTooltip } from "@visx/tooltip";
import { scaleTime } from "@visx/scale";
import { margin } from "@/components/dashboard/charts/shared/timelineUtils";
import { scaleLinear } from "@visx/scale";
import { TooltipData } from "@/types/chart";
import { useVaryingChartState } from "./useVaryingChartState";

export function useChartState(
    data: (TimelineNumericalPoint | TimelineCategoricalPoint)[],
    chartType: ChartType,
    sectionType: SectionType,
    bucketSize: number,
    baseTime: number,
    svgRef: React.RefObject<SVGSVGElement | null>,
    containerRef: React.RefObject<HTMLDivElement | null>,
    innerWidth: number,
    innerHeight: number,
) {
    const { timeRange, draggedTime, updateTimeRange, initTimeRange } = useSectionState();
    const { maxValue, getTooltipData, getCategoryColor, uniqueCategories, handleLegendClick } = useVaryingChartState(data, chartType, bucketSize);
    const currentTimeRange = useMemo(() => {
        return { start: timeRange[sectionType].start + draggedTime[sectionType], end: timeRange[sectionType].end + draggedTime[sectionType] };
    }, [timeRange, sectionType, draggedTime]);

    const {
        tooltipData,
        tooltipLeft,
        tooltipTop,
        tooltipOpen,
        showTooltip,
        hideTooltip,
    } = useTooltip<TooltipData>();

    useEffect(() => {
        initTimeRange(sectionType);
    }, [sectionType, initTimeRange]);

    // Time scale
    const timeScale = useMemo(() => {
        const rangeStart = baseTime + currentTimeRange.start;
        const rangeEnd = baseTime + currentTimeRange.end;

        return scaleTime({
            domain: [rangeStart, rangeEnd],
            range: [0, innerWidth],
        });
    }, [baseTime, currentTimeRange, innerWidth]);

    // Value scale
    const valueScale = useMemo(() => {
        if (data.length === 0 || innerHeight <= 0) {
            return scaleLinear({
                domain: [0, 1],
                range: [innerHeight || 1, 0],
            });
        }
        return scaleLinear({
            domain: [0, maxValue],
            range: [innerHeight, 0],
            nice: true,
        });
    }, [data.length, maxValue, innerHeight]);

    // Bar width calculation
    const barWidth = useMemo(() => {
        if (data.length === 0) return 0;

        const bucketCount = (currentTimeRange.end - currentTimeRange.start) / bucketSize;
        const bucketWidth = innerWidth / bucketCount;

        return bucketWidth;
    }, [data.length, bucketSize, innerWidth, currentTimeRange]);

    // Handle brush end (zoom)
    const handleBrushChange = useCallback((bounds: { x0: number, x1: number } | null) => {
        if (bounds === null) return;

        const brushStart = Math.floor(bounds.x0 / bucketSize) * bucketSize;
        const brushEnd = Math.ceil(bounds.x1 / bucketSize) * bucketSize;

        updateTimeRange(sectionType, {
            start: brushStart - baseTime,
            end: brushEnd - baseTime,
        });
    }, [sectionType, baseTime, updateTimeRange, bucketSize]);

    // Handle mouse move for tooltip
    const handleMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
        if (!svgRef.current || !containerRef.current || data.length === 0) return;

        const svgRect = svgRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const x = event.clientX - svgRect.left - margin.left;
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
        if (tooltipLeft + tooltipWidth > containerRect.right - padding) {
            tooltipLeft = containerRect.right - tooltipWidth - padding;
        }
        if (tooltipLeft < containerRect.left + padding) {
            tooltipLeft = containerRect.left + padding;
        }

        // Constrain vertically
        if (tooltipTop + tooltipHeight > containerRect.bottom - padding) {
            tooltipTop = containerRect.bottom - tooltipHeight - padding;
        }
        if (tooltipTop < containerRect.top + padding) {
            tooltipTop = containerRect.top + padding;
        }

        showTooltip({
            tooltipLeft: tooltipLeft - containerRect.left,
            tooltipTop: tooltipTop - containerRect.top,
            tooltipData
        });
    }, [getTooltipData, timeScale, hideTooltip, showTooltip, containerRef, data.length, svgRef]);

    const handleDoubleClick = useCallback(() => {
        initTimeRange(sectionType);
    }, [sectionType, initTimeRange]);

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
        getCategoryColor,
        uniqueCategories,
        handleLegendClick,
    }
}