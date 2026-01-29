'use client'

import { Bar } from '@visx/shape';
import { colors } from '../../../../utils/timelineUtils';
import { TimelinePlotProps, TimelineCategoricalPoint } from "@/types/chart";

export const BarcodeTimelinePlot: React.FC<TimelinePlotProps<TimelineCategoricalPoint> & { getColor: (point: TimelineCategoricalPoint) => { color: string, opacity: number } }> = ({
    timeScale,
    valueScale,
    barWidth,
    data,
    height,
    getColor,
}) => {
    return (
        valueScale && (
            <>
                {data.map((d, i) => {
                    if (d.value.length === 1 && d.value[0].count === 1) {
                        return (
                            <Bar
                                key={`barcode-${i}`}
                                x={timeScale(d.timestamp) + barWidth * 0.4}
                                y={valueScale(1)}
                                width={barWidth * 0.2}
                                height={height}
                                fill={colors[2]}
                            />
                        );
                    } else {
                        return (
                            <Bar
                                key={`barcode-${i}`}
                                x={timeScale(d.timestamp) + barWidth * 0.2}
                                y={valueScale(1)}
                                width={barWidth * 0.6}
                                height={height}
                                fill={getColor(d).color}
                                opacity={getColor(d).opacity}
                            />
                        );
                    }

                })}
            </>
        )
    );
}
