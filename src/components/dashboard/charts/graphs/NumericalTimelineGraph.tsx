'use client'

import { useMemo } from "react";
import { colors, gray } from '../../../../utils/timelineUtils';
import { TimelineChartGraphProps, TimelineNumericalPoint } from "@/types/chart";

export const NumericalTimelineGraph: React.FC<TimelineChartGraphProps<TimelineNumericalPoint>> = ({
    timeScale,
    valueScale,
    barWidth,
    data,
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
                    const lineStartX = x + barWidth * 0.05;
                    const lineEndX = x + barWidth * 0.95;
                    return (
                        <line
                            key={`avg-line-${i}`}
                            x1={lineStartX}
                            y1={yValue}
                            x2={lineEndX}
                            y2={yValue}
                            stroke={colors[0]}
                            strokeWidth={3}
                        />
                    );
                })}
                {chartData.filter(d => !d.isSingle && d.min !== undefined && d.max !== undefined && !isNaN(d.min) && !isNaN(d.max)).map((d, i) => {
                    const x = timeScale(d.timestamp);
                    const minY = valueScale(d.min);
                    const maxY = valueScale(d.max);
                    if (isNaN(minY) || isNaN(maxY) || minY === undefined || maxY === undefined) return null;
                    const centerX = x + barWidth / 2;
                    return (
                        <g key={`min-max-${i}`}>
                            <line
                                x1={centerX}
                                y1={minY}
                                x2={centerX}
                                y2={maxY}
                                stroke={gray}
                                strokeWidth={1.5}
                                strokeDasharray="3,3"
                            />
                            <circle
                                cx={centerX}
                                cy={minY}
                                r={2.5}
                                fill={colors[2]}
                            />
                            <circle
                                cx={centerX}
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

