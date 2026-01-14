'use client'

import { Bar } from '@visx/shape';
import { useMemo } from "react";
import { gray, margin } from '../shared/timelineUtils';
import { TimelineChartGraphProps, TimelineCategoricalPoint } from "@/types/chart";

type CategoricalDataPoint = {
    timestamp: number;
    categories: Array<{
        category: string;
        count: number;
        index: number;
    }>;
};

export const CategoricalTimelineGraph: React.FC<TimelineChartGraphProps<TimelineCategoricalPoint>> = ({
    timeScale,
    valueScale,
    barWidth,
    data,
    height,
    getCategoryColor
}) => {
    const innerHeight = height - margin.top - margin.bottom;

    // Prepare data - data is already grouped by timestamp
    const chartData = useMemo(() => {
        // Extract all unique categories
        const categorySet = new Set<string>();
        data.forEach(d => {
            d.value.forEach(item => {
                categorySet.add(item.category);
            });
        });
        const uniqueCategories = [...categorySet].sort();

        // Map each data point (already grouped by timestamp) to chart data format
        return data.map((d) => {
            // Create a map for quick lookup of counts by category
            const categoryCountMap = new Map<string, number>();
            d.value.forEach(item => {
                categoryCountMap.set(item.category, item.count);
            });

            return {
                timestamp: d.timestamp,
                categories: uniqueCategories.map((cat, idx) => ({
                    category: cat,
                    count: categoryCountMap.get(cat) || 0,
                    index: idx,
                })),
            } as CategoricalDataPoint;
        });
    }, [data]);

    return (
        valueScale && (
            <>
                {chartData.map((d, i) => {
                    const x = timeScale(d.timestamp) as number;
                    let yOffset = innerHeight;
                    return (
                        <g key={`stack-${i}`}>
                            {d.categories.map((cat, catIdx) => {
                                const barHeight = valueScale(0) - valueScale(cat.count);
                                const y = yOffset - barHeight;
                                yOffset -= barHeight;
                                return (
                                    <Bar
                                        key={`cat-${i}-${catIdx}`}
                                        x={x + barWidth * 0.05}
                                        y={y}
                                        width={barWidth * 0.9}
                                        height={barHeight}
                                        fill={getCategoryColor ? getCategoryColor(cat.category) : gray}
                                    />
                                );
                            })}
                        </g>
                    );
                })}
            </>
        )
    );
};
