'use client'

import { Bar } from '@visx/shape';

import { useMemo } from "react";
import { colors } from '../shared/timelineUtils';
import { TimelineChartGraphProps, TimelineNumericalPoint } from "@/types/chart";

export const NumericalTimelineGraph: React.FC<TimelineChartGraphProps<TimelineNumericalPoint>> = ({
    timeScale,
    valueScale,
    barWidth,
    data,
    height
}) => {
    // Prepare data
    const chartData = useMemo(() => {
        return data.map(d => ({
            timestamp: d.timestamp,
            avg: d.avg,
            min: d.min,
            max: d.max,
            isSingle: d.avg === d.min && d.avg === d.max,
        }));
    }, [data]);

    return (
        valueScale && (
            <>
                {chartData.map((d, i) => {
                    if (d.avg === undefined || isNaN(d.avg)) return null;
                    const x = timeScale(d.timestamp);
                    const yValue = valueScale(d.avg);
                    if (isNaN(yValue) || yValue === undefined) return null;
                    const barHeight = Math.max(0, height - yValue);
                    return (
                        <Bar
                            key={`bar-${i}`}
                            x={x + barWidth * 0.05}
                            y={yValue}
                            width={barWidth * 0.9}
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
                                cx={x + barWidth / 2}
                                cy={minY}
                                r={2.5}
                                fill={colors[2]}
                            />
                            <circle
                                cx={x + barWidth / 2}
                                cy={maxY}
                                r={2.5}
                                fill={colors[1]}
                            />
                        </g>
                    );
                })}
            </>
        )
    );
};

