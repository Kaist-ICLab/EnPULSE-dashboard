'use client'

import useSectionState from "@/hooks/useSectionState";
import { SectionType, TimelineNumericalValue } from "@/types/chart";
import { scaleTime, scaleLinear } from '@visx/scale';
import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { Brush } from '@visx/brush';
import { useTooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { useMemo, useRef, useEffect, useCallback } from "react";
import { extent, max } from 'd3-array';
import { formatTime, colors, margin } from './shared/timelineUtils';

type NumericalDataPoint = {
    timestamp: number;
    avg: number;
    min: number;
    max: number;
    isSingle: boolean;
};

interface NumericalTimelineChartProps {
    sectionType: SectionType;
    baseTime: number;
    data: { timestamp: number[], value: TimelineNumericalValue[] };
    bucketSize: number;
    width: number;
    height: number;
}

const NumericalTimelineChart: React.FC<NumericalTimelineChartProps> = ({
    sectionType,
    baseTime,
    data,
    bucketSize,
    width,
    height
}) => {
    const { timeRange, updateTimeRange, initTimeRange } = useSectionState();
    const currentTimeRange = useMemo(() => timeRange[sectionType], [timeRange, sectionType]);

    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const {
        tooltipData,
        tooltipLeft,
        tooltipTop,
        tooltipOpen,
        showTooltip,
        hideTooltip,
    } = useTooltip<NumericalDataPoint>();

    useEffect(() => {
        initTimeRange(sectionType);
    }, [sectionType, initTimeRange]);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Prepare data
    const chartData = useMemo(() => {
        const values = data.value;
        return data.timestamp.map((ts, i) => {
            const value = values[i];
            if (!value || value.avg === undefined || isNaN(value.avg)) {
                return null;
            }

            return {
                timestamp: ts,
                avg: value.avg,
                min: value.min,
                max: value.max,
                isSingle: value.avg === value.min && value.avg === value.max,
            };
        }).filter((d): d is NumericalDataPoint => d !== null);
    }, [data]);

    // Time scale
    const timeScale = useMemo(() => {
        if (chartData.length === 0) {
            return scaleTime({
                domain: [baseTime + currentTimeRange.start, baseTime + currentTimeRange.end],
                range: [0, innerWidth],
            });
        }

        const timestamps = chartData.map(d => d.timestamp);
        const timeExtent = extent(timestamps);
        if (!timeExtent[0] || !timeExtent[1]) {
            return scaleTime({
                domain: [baseTime + currentTimeRange.start, baseTime + currentTimeRange.end],
                range: [0, innerWidth],
            });
        }

        const rangeStart = baseTime + currentTimeRange.start;
        const rangeEnd = baseTime + currentTimeRange.end;

        return scaleTime({
            domain: [rangeStart, rangeEnd],
            range: [0, innerWidth],
        });
    }, [chartData, baseTime, currentTimeRange, innerWidth]);

    // Value scale
    const valueScale = useMemo(() => {
        if (chartData.length === 0 || innerHeight <= 0) {
            return scaleLinear({
                domain: [0, 1],
                range: [innerHeight || 1, 0],
            });
        }
        const maxValue = max(chartData, d => d.max !== undefined && !isNaN(d.max) ? d.max : 0) || 0;
        if (maxValue <= 0 || isNaN(maxValue)) {
            return scaleLinear({
                domain: [0, 1],
                range: [innerHeight, 0],
            });
        }
        return scaleLinear({
            domain: [0, maxValue * 1.1],
            range: [innerHeight, 0],
            nice: true,
        });
    }, [chartData, innerHeight]);

    // Bar width calculation
    const barWidth = useMemo(() => {
        if (chartData.length === 0) return 0;
        const bucketWidth = (bucketSize / (timeRange[sectionType].end - timeRange[sectionType].start)) * innerWidth;

        console.log('bucketWidth', bucketWidth);
        return Math.max(2, Math.min(bucketWidth * 0.9, innerWidth / chartData.length));
    }, [chartData, bucketSize, innerWidth, timeRange, sectionType]);

    // Handle brush end (zoom)
    const handleBrushChange = useCallback((bounds: unknown) => {
        const brushBounds = bounds as { start?: { x: number, y: number }, end?: { x: number, y: number } } | null;
        if (!brushBounds || !brushBounds.start || !brushBounds.end) return;

        const startTime = timeScale.invert(brushBounds.start.x);
        const endTime = timeScale.invert(brushBounds.end.x);

        if (startTime && endTime) {
            updateTimeRange(sectionType, {
                start: startTime.getTime() - baseTime,
                end: endTime.getTime() - baseTime,
            });
        }
    }, [timeScale, sectionType, baseTime, updateTimeRange]);

    // Handle mouse move for tooltip
    const handleMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
        if (!svgRef.current || !containerRef.current || chartData.length === 0) return;

        const svgRect = svgRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const x = event.clientX - svgRect.left - margin.left;
        const time = timeScale.invert(x);
        if (!time) return;

        const timeMs = time.getTime();
        let closestData: NumericalDataPoint | null = null;
        let minDistance = Infinity;

        chartData.forEach(d => {
            const distance = Math.abs(d.timestamp - timeMs);
            if (distance < minDistance && distance < bucketSize) {
                minDistance = distance;
                closestData = d;
            }
        });

        if (closestData == null) {
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
            tooltipData: closestData,
        });
    }, [chartData, timeScale, bucketSize, hideTooltip, showTooltip]);

    if (width === 0 || height === 0) {
        return (
            <div ref={containerRef} className='w-full flex flex-row justify-center items-center' style={{ height: '100px' }} />
        );
    }

    const defaultYScale = scaleLinear({ domain: [0, 1], range: [0, 1] });

    return (
        <div className="w-full flex flex-col justify-center items-center" ref={containerRef}>
            <div
                className="w-full flex flex-row justify-center items-center"
                style={{ height: `${height}px`, position: 'relative' }}
            >
                <svg
                    ref={svgRef}
                    width={width}
                    height={height}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={hideTooltip}
                >
                    <Group left={margin.left} top={margin.top}>
                        {valueScale && (
                            <>
                                {chartData.map((d, i) => {
                                    if (d.avg === undefined || isNaN(d.avg)) return null;
                                    const x = timeScale(d.timestamp);
                                    const yValue = valueScale(d.avg);
                                    if (isNaN(yValue) || yValue === undefined) return null;
                                    const barHeight = Math.max(0, innerHeight - yValue);
                                    return (
                                        <Bar
                                            key={`bar-${i}`}
                                            x={x - barWidth}
                                            y={yValue}
                                            width={barWidth}
                                            height={barHeight}
                                            fill={colors[0]}
                                        />
                                    );
                                })}
                                {chartData.filter(d => !d.isSingle && d.min !== undefined && d.max !== undefined && !isNaN(d.min) && !isNaN(d.max)).map((d, i) => {
                                    const x = timeScale(d.timestamp);
                                    const minY = valueScale(d.min);
                                    const maxY = valueScale(d.max);
                                    if (isNaN(minY) || isNaN(maxY) || minY === undefined || maxY === undefined) return null;
                                    return (
                                        <g key={`min-max-${i}`}>
                                            <circle
                                                cx={x}
                                                cy={minY}
                                                r={2.5}
                                                fill={colors[2]}
                                            />
                                            <circle
                                                cx={x}
                                                cy={maxY}
                                                r={2.5}
                                                fill={colors[1]}
                                            />
                                        </g>
                                    );
                                })}
                            </>
                        )}
                        <Brush
                            xScale={timeScale}
                            yScale={valueScale || defaultYScale}
                            width={innerWidth}
                            height={innerHeight}
                            margin={margin}
                            handleSize={8}
                            resizeTriggerAreas={['left', 'right']}
                            brushDirection="horizontal"
                            onBrushEnd={handleBrushChange}
                        />
                    </Group>
                </svg>
                {tooltipOpen && tooltipData && (
                    <TooltipWithBounds
                        top={tooltipTop}
                        left={tooltipLeft}
                        style={{
                            ...defaultStyles,
                            position: 'absolute',
                        }}
                    >
                        <div>
                            <div>Time: {formatTime(tooltipData.timestamp)} ~ {formatTime(tooltipData.timestamp + bucketSize)}</div>
                            {tooltipData.isSingle ? (
                                <div>Value: {tooltipData.avg.toFixed(2)}</div>
                            ) : (
                                <>
                                    <div>Average: {tooltipData.avg.toFixed(2)}</div>
                                    <div>Min: {tooltipData.min.toFixed(2)}</div>
                                    <div>Max: {tooltipData.max.toFixed(2)}</div>
                                </>
                            )}
                        </div>
                    </TooltipWithBounds>
                )}
            </div>
        </div>
    );
};

export default NumericalTimelineChart;

