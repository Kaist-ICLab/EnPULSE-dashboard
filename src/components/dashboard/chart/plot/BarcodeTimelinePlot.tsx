'use client'

import { Bar } from '@visx/shape';
import { TimelinePlotProps, TimelineCategoricalPoint } from "@/types/chart";

export const BarcodeTimelinePlot: React.FC<TimelinePlotProps<TimelineCategoricalPoint> & { getColor: (point: TimelineCategoricalPoint) => { color: string, opacity: number }[] }> = ({
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
                    return (
                        <Bar
                            key={`barcode-${i}`}
                            x={timeScale(d.timestamp) + barWidth * 0.2}
                            y={valueScale(1)}
                            width={barWidth * 0.6}
                            height={height}
                            fill={getColor(d)[0].color}
                            opacity={getColor(d)[0].opacity}
                        />
                    );
                })}
            </>
        )
    );
}
