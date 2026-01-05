'use client'

import useSectionState from "@/hooks/useSectionState";
import { SectionType, TimelineCategoricalValue } from "@/types/chart";
import { scaleTime, scaleLinear } from '@visx/scale';
import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { Brush } from '@visx/brush';
import { LegendItem, LegendLabel, LegendOrdinal } from '@visx/legend';
import { useTooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { extent, max } from 'd3-array';
import { formatTime, colors, gray, margin } from './shared/timelineUtils';

type CategoricalDataPoint = {
    timestamp: number;
    categories: Array<{
        category: string;
        count: number;
        index: number;
    }>;
};

interface CategoricalTimelineChartProps {
    sectionType: SectionType;
    baseTime: number;
    data: { timestamp: number[], value: TimelineCategoricalValue[] };
    bucketSize: number;
}

const CategoricalTimelineChart: React.FC<CategoricalTimelineChartProps> = ({
    sectionType,
    baseTime,
    data,
    bucketSize
}) => {
    const { timeRange, updateTimeRange, initTimeRange } = useSectionState();
    const currentTimeRange = useMemo(() => timeRange[sectionType], [timeRange, sectionType]);

    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const [width, setWidth] = useState(800);
    const [height] = useState(100);
    const colorQueue = useRef<{ traceIndex: number, colorIndex: number }[] | null>(null);
    const [visibleCategories, setVisibleCategories] = useState<Set<number>>(new Set());

    const {
        tooltipData,
        tooltipLeft,
        tooltipTop,
        tooltipOpen,
        showTooltip,
        hideTooltip,
    } = useTooltip<CategoricalDataPoint>();

    useEffect(() => {
        initTimeRange(sectionType);
    }, [sectionType, initTimeRange]);

    useEffect(() => {
        if (containerRef.current) {
            const updateSize = () => {
                if (containerRef.current) {
                    setWidth(containerRef.current.offsetWidth);
                }
            };
            updateSize();
            window.addEventListener('resize', updateSize);
            return () => window.removeEventListener('resize', updateSize);
        }
    }, []);

    const legendHeight = 30;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom - legendHeight;

    // Prepare data
    const chartData = useMemo(() => {
        const values = data.value;
        const uniqueCategories = [...new Set(values.map(v => v.value))].sort();

        if (uniqueCategories.length === 0) {
            colorQueue.current = null;
        } else if (colorQueue.current == null) {
            colorQueue.current = uniqueCategories
                .filter((_, i) => i < colors.length)
                .map((_, i) => ({ traceIndex: i, colorIndex: i }));
            setVisibleCategories(new Set(colorQueue.current.map(item => item.traceIndex)));
        }

        // Group data by timestamp
        const timestampMap = new Map<number, Map<string, number>>();
        data.timestamp.forEach((ts, i) => {
            if (!timestampMap.has(ts)) {
                timestampMap.set(ts, new Map());
            }
            timestampMap.get(ts)!.set(values[i].value, values[i].count);
        });

        return Array.from(timestampMap.entries()).map(([ts, categoryMap]) => ({
            timestamp: ts,
            categories: uniqueCategories.map((cat, idx) => ({
                category: cat,
                count: categoryMap.get(cat) || 0,
                index: idx,
            })),
        })) as CategoricalDataPoint[];
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

    // Value scale for stacked bars
    const categoricalValueScale = useMemo(() => {
        if (chartData.length === 0) {
            return scaleLinear({
                domain: [0, 1],
                range: [innerHeight, 0],
            });
        }
        const maxStack = max(chartData, d => {
            return d.categories.reduce((sum, cat) => sum + cat.count, 0);
        }) || 0;
        return scaleLinear({
            domain: [0, maxStack * 1.1],
            range: [innerHeight, 0],
            nice: true,
        });
    }, [chartData, innerHeight]);

    // Bar width calculation
    const barWidth = useMemo(() => {
        if (chartData.length === 0) return 0;

        const timestamps = chartData.map(d => d.timestamp);
        const timeExtent = extent(timestamps);

        if (!timeExtent[0] || !timeExtent[1]) return 0;

        const timeRange = timeExtent[1] - timeExtent[0];
        const bucketWidth = (bucketSize / timeRange) * innerWidth;

        console.log('bucketWidth', bucketWidth);
        return Math.max(2, Math.min(bucketWidth * 0.9, innerWidth / chartData.length));
    }, [chartData, bucketSize, innerWidth]);

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

    // Handle legend click
    const handleLegendClick = useCallback((categoryIndex: number) => {
        if (colorQueue.current == null) return;

        const isVisible = visibleCategories.has(categoryIndex);
        const newVisibleCategories = new Set(visibleCategories);

        if (!isVisible) {
            if (colorQueue.current.length === colors.length) {
                const { traceIndex: removedTraceIndex } = colorQueue.current.splice(0, 1)[0];
                const colorIndex = colorQueue.current[colorQueue.current.length - 1]?.colorIndex ?? 0;
                colorQueue.current.push({ traceIndex: categoryIndex, colorIndex });
                newVisibleCategories.delete(removedTraceIndex);
            } else {
                const existingIndex = colorQueue.current.map(item => item.colorIndex);
                for (let i = 0; i < colors.length; i++) {
                    if (!existingIndex.includes(i)) {
                        colorQueue.current.push({ traceIndex: categoryIndex, colorIndex: i });
                        break;
                    }
                }
            }
            newVisibleCategories.add(categoryIndex);
        } else {
            const spliceIndex = colorQueue.current.findIndex(item => item.traceIndex === categoryIndex);
            if (spliceIndex !== -1) {
                colorQueue.current.splice(spliceIndex, 1);
            }
            newVisibleCategories.delete(categoryIndex);
        }

        setVisibleCategories(newVisibleCategories);
    }, [visibleCategories]);

    // Handle mouse move for tooltip
    const handleMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
        if (!svgRef.current || !containerRef.current || chartData.length === 0) return;

        const svgRect = svgRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const x = event.clientX - svgRect.left - margin.left;
        const time = timeScale.invert(x);
        if (!time) return;

        const timeMs = time.getTime();
        let closestData: CategoricalDataPoint | null = null;
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
        const tooltipHeight = 150; // Approximate tooltip height (categorical can be taller)
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
    }, [chartData, timeScale, bucketSize, showTooltip, hideTooltip]);

    // Get category color
    const getCategoryColor = useCallback((categoryIndex: number) => {
        if (colorQueue.current == null) return gray;
        const entry = colorQueue.current.find(item => item.traceIndex === categoryIndex);
        if (entry && visibleCategories.has(categoryIndex)) {
            return colors[entry.colorIndex];
        }
        return gray;
    }, [visibleCategories]);

    // Get unique categories for legend
    const uniqueCategories = useMemo(() => {
        const values = data.value;
        return [...new Set(values.map(v => v.value))].sort();
    }, [data]);

    if (width === 0 || height === 0) {
        return (
            <div ref={containerRef} className='w-full flex flex-row justify-center items-center' style={{ height: '100px' }} />
        );
    }

    const defaultYScale = scaleLinear({ domain: [0, 1], range: [0, 1] });

    return (
        <div className='w-full flex flex-col justify-center items-center'>
            {uniqueCategories.length > 0 && (
                <div className="w-full flex justify-center mb-2" style={{ height: legendHeight }}>
                    <LegendOrdinal
                        scale={{
                            domain: uniqueCategories,
                            range: uniqueCategories.map((_, idx) => getCategoryColor(idx)),
                        } as unknown as Parameters<typeof LegendOrdinal>[0]['scale']}
                        labelFormat={(label) => label}
                        itemMargin="0 10px"
                    >
                        {(labels) => (
                            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {labels.map((label, i) => {
                                    const categoryIndex = uniqueCategories.indexOf(label.text);
                                    const isVisible = visibleCategories.has(categoryIndex);
                                    return (
                                        <LegendItem
                                            key={`legend-${i}`}
                                            onClick={() => handleLegendClick(categoryIndex)}
                                            style={{ cursor: 'pointer', opacity: isVisible ? 1 : 0.5 }}
                                        >
                                            <div
                                                style={{
                                                    width: 12,
                                                    height: 12,
                                                    backgroundColor: getCategoryColor(categoryIndex),
                                                    marginRight: 4,
                                                    display: 'inline-block',
                                                }}
                                            />
                                            <LegendLabel align="left" margin="0 0 0 4px">
                                                {label.text}
                                            </LegendLabel>
                                        </LegendItem>
                                    );
                                })}
                            </div>
                        )}
                    </LegendOrdinal>
                </div>
            )}
            <div
                ref={containerRef}
                className='w-full flex flex-row justify-center items-center'
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
                        {categoricalValueScale && (
                            <>
                                {chartData.map((d, i) => {
                                    const x = timeScale(d.timestamp);
                                    let yOffset = innerHeight;
                                    return (
                                        <g key={`stack-${i}`}>
                                            {d.categories.map((cat, catIdx) => {
                                                const barHeight = categoricalValueScale(0) - categoricalValueScale(cat.count);
                                                const y = yOffset - barHeight;
                                                yOffset -= barHeight;
                                                const isVisible = visibleCategories.has(cat.index);
                                                return (
                                                    <Bar
                                                        key={`cat-${i}-${catIdx}`}
                                                        x={x - barWidth / 2}
                                                        y={y}
                                                        width={barWidth}
                                                        height={barHeight}
                                                        fill={isVisible ? getCategoryColor(cat.index) : gray}
                                                        opacity={isVisible ? 1 : 0.3}
                                                    />
                                                );
                                            })}
                                        </g>
                                    );
                                })}
                            </>
                        )}
                        <Brush
                            xScale={timeScale}
                            yScale={categoricalValueScale || defaultYScale}
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
                            {tooltipData.categories && tooltipData.categories.length > 0 ? (
                                tooltipData.categories.map((cat) => (
                                    <div key={cat.category}>
                                        {cat.category}: {cat.count}
                                    </div>
                                ))
                            ) : (
                                <div>No data available</div>
                            )}
                        </div>
                    </TooltipWithBounds>
                )}
            </div>
        </div>
    );
};

export default CategoricalTimelineChart;

