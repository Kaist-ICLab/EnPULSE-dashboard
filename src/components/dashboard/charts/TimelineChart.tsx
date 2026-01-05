'use client'

import useSectionState from "@/hooks/useSectionState";
import { SectionType, TimelineCategoricalValue, TimelineNumericalValue } from "@/types/chart";
import { scaleTime, scaleLinear } from '@visx/scale';
import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { Brush } from '@visx/brush';
import { LegendItem, LegendLabel, LegendOrdinal } from '@visx/legend';
import { useTooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { extent, max } from 'd3-array';

const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
};

const colors = [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
];
const gray = '#d1d5db';

const margin = { top: 30, right: 0, bottom: 0, left: 0 };

type NumericalDataPoint = {
    timestamp: number;
    avg: number;
    min: number;
    max: number;
    isSingle: boolean;
};

type CategoricalDataPoint = {
    timestamp: number;
    categories: Array<{
        category: string;
        count: number;
        index: number;
    }>;
};

type ChartDataPoint = NumericalDataPoint | CategoricalDataPoint;

interface TimelineChartProps {
    sectionType: SectionType;
    chartType: 'categorical' | 'numerical';
    baseTime: number;
    data: { timestamp: number[], value: (TimelineNumericalValue | TimelineCategoricalValue)[] };
    bucketSize: number;
}

const TimelineChart: React.FC<TimelineChartProps> = ({
    sectionType,
    chartType,
    baseTime,
    data,
    bucketSize
}) => {
    const { timeRange, updateTimeRange, initTimeRange } = useSectionState();
    const currentTimeRange = useMemo(() => timeRange[sectionType], [timeRange, sectionType]);

    const [width, setWidth] = useState(800);
    const [height] = useState(100);
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const colorQueue = useRef<{ traceIndex: number, colorIndex: number }[] | null>(null);
    const [visibleCategories, setVisibleCategories] = useState<Set<number>>(new Set());

    type TooltipData = NumericalDataPoint | CategoricalDataPoint;
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

    const legendHeight = chartType === 'categorical' ? 30 : 0;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom - legendHeight;

    // Prepare data based on chart type
    const chartData = useMemo(() => {
        if (chartType === 'numerical') {
            const values = data.value as TimelineNumericalValue[];
            return data.timestamp.map((ts, i) => ({
                timestamp: ts,
                avg: values[i].avg_value,
                min: values[i].min_value,
                max: values[i].max_value,
                isSingle: values[i].avg_value === values[i].min_value &&
                    values[i].avg_value === values[i].max_value,
            })) as NumericalDataPoint[];
        } else {
            const values = data.value as TimelineCategoricalValue[];
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
        }
    }, [data, chartType]);

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

    // Value scale for numerical
    const valueScale = useMemo(() => {
        if (chartType !== 'numerical') return null;
        const numericalData = chartData as NumericalDataPoint[];
        if (numericalData.length === 0) {
            return scaleLinear({
                domain: [0, 1],
                range: [innerHeight, 0],
            });
        }
        const maxValue = max(numericalData, d => d.max) || 0;
        return scaleLinear({
            domain: [0, maxValue * 1.1],
            range: [innerHeight, 0],
            nice: true,
        });
    }, [chartData, chartType, innerHeight]);

    // Value scale for categorical (stacked)
    const categoricalValueScale = useMemo(() => {
        if (chartType !== 'categorical') return null;
        const categoricalData = chartData as CategoricalDataPoint[];
        if (categoricalData.length === 0) {
            return scaleLinear({
                domain: [0, 1],
                range: [innerHeight, 0],
            });
        }
        const maxStack = max(categoricalData, d => {
            return d.categories.reduce((sum, cat) => sum + cat.count, 0);
        }) || 0;
        return scaleLinear({
            domain: [0, maxStack * 1.1],
            range: [innerHeight, 0],
            nice: true,
        });
    }, [chartData, chartType, innerHeight]);

    // Bar width calculation
    const barWidth = useMemo(() => {
        if (chartData.length === 0) return 0;
        const timestamps = chartData.map(d => d.timestamp);
        const timeExtent = extent(timestamps);
        if (!timeExtent[0] || !timeExtent[1]) return 0;
        const timeRange = timeExtent[1] - timeExtent[0];
        const bucketWidth = (bucketSize / timeRange) * innerWidth;
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
        if (!svgRef.current) return;

        const rect = svgRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left - margin.left;
        const time = timeScale.invert(x);
        if (!time) return;

        const timeMs = time.getTime();
        let closestData: ChartDataPoint | null = null;
        let minDistance = Infinity;

        chartData.forEach(d => {
            const distance = Math.abs(d.timestamp - timeMs);
            if (distance < minDistance && distance < bucketSize) {
                minDistance = distance;
                closestData = d;
            }
        });

        if (closestData) {
            showTooltip({
                tooltipLeft: event.clientX,
                tooltipTop: event.clientY,
                tooltipData: closestData,
            });
        }
    }, [chartData, timeScale, bucketSize, showTooltip]);

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
        if (chartType !== 'categorical') return [];
        const values = data.value as TimelineCategoricalValue[];
        return [...new Set(values.map(v => v.value))].sort();
    }, [data, chartType]);

    if (width === 0 || height === 0) {
        return (
            <div ref={containerRef} className='w-full flex flex-row justify-center items-center' style={{ height: '100px' }} />
        );
    }

    const defaultYScale = scaleLinear({ domain: [0, 1], range: [0, 1] });

    return (
        <div className='w-full flex flex-col justify-center items-center'>
            {chartType === 'categorical' && uniqueCategories.length > 0 && (
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
                style={{ height: `${height}px` }}
            >
                <svg
                    ref={svgRef}
                    width={width}
                    height={height}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={hideTooltip}
                >
                    <Group left={margin.left} top={margin.top}>
                        {chartType === 'numerical' && valueScale && (
                            <>
                                {(chartData as NumericalDataPoint[]).map((d, i) => {
                                    const x = timeScale(d.timestamp);
                                    const barHeight = innerHeight - valueScale(d.avg);
                                    return (
                                        <Bar
                                            key={`bar-${i}`}
                                            x={x - barWidth / 2}
                                            y={valueScale(d.avg)}
                                            width={barWidth}
                                            height={barHeight}
                                            fill={colors[0]}
                                        />
                                    );
                                })}
                                {(chartData as NumericalDataPoint[]).filter(d => !d.isSingle).map((d, i) => {
                                    const x = timeScale(d.timestamp);
                                    return (
                                        <g key={`min-max-${i}`}>
                                            <circle
                                                cx={x}
                                                cy={valueScale(d.min)}
                                                r={2.5}
                                                fill={colors[2]}
                                            />
                                            <circle
                                                cx={x}
                                                cy={valueScale(d.max)}
                                                r={2.5}
                                                fill={colors[1]}
                                            />
                                        </g>
                                    );
                                })}
                            </>
                        )}
                        {chartType === 'categorical' && categoricalValueScale && (
                            <>
                                {(chartData as CategoricalDataPoint[]).map((d, i) => {
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
                            yScale={valueScale || categoricalValueScale || defaultYScale}
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
                        style={defaultStyles}
                    >
                        {chartType === 'numerical' ? (
                            <div>
                                <div>Time: {formatTime(tooltipData.timestamp)} ~ {formatTime(tooltipData.timestamp + bucketSize)}</div>
                                {(tooltipData as NumericalDataPoint).isSingle ? (
                                    <div>Value: {(tooltipData as NumericalDataPoint).avg.toFixed(2)}</div>
                                ) : (
                                    <>
                                        <div>Average: {(tooltipData as NumericalDataPoint).avg.toFixed(2)}</div>
                                        <div>Min: {(tooltipData as NumericalDataPoint).min.toFixed(2)}</div>
                                        <div>Max: {(tooltipData as NumericalDataPoint).max.toFixed(2)}</div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div>
                                <div>Time: {formatTime(tooltipData.timestamp)} ~ {formatTime(tooltipData.timestamp + bucketSize)}</div>
                                {(tooltipData as CategoricalDataPoint).categories.map((cat) => (
                                    <div key={cat.category}>
                                        {cat.category}: {cat.count}
                                    </div>
                                ))}
                            </div>
                        )}
                    </TooltipWithBounds>
                )}
            </div>
        </div>
    );
};

export default TimelineChart;
