'use client'

import { Bar } from '@visx/shape';
import { gray } from '../../../../utils/timelineUtils';
import { TimelineChartGraphProps, TimelineCategoricalPoint } from "@/types/chart";

export const CategoricalTimelineGraph: React.FC<TimelineChartGraphProps<TimelineCategoricalPoint>> = ({
    timeScale,
    valueScale,
    barWidth,
    data,
    height,
    getCategoryColor
}) => {
    return (
        valueScale && (
            <>
                {data.map((d, i) => {
                    const x = timeScale(d.timestamp);
                    return (
                        <g key={`stack-${i}`}>
                            {d.value.map((cat, catIdx) => {
                                const barHeight = height - valueScale(cat.count);
                                const y = valueScale(cat.aggregated)
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
