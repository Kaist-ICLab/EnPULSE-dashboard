import { TimelinePlotProps, TimelineHeatmapPoint } from "@/types/chart";
import { useMemo } from "react";

export const HeatmapTimelinePlot: React.FC<TimelinePlotProps<TimelineHeatmapPoint> & {
    getColor: (point: TimelineHeatmapPoint) => { color: string; opacity: number }[];
}> = ({
    timeScale,
    valueScale,
    barWidth,
    data,
    height,
    getColor,
}) => {
        const rectHeight = useMemo(() => {
            return valueScale(0) - valueScale(1)
        }, [valueScale])

        return (
            <>{
                data.map((d, i) => {
                    const colors = getColor(d)
                    return d.value.map((item, j) => {
                        return (
                            <rect key={`heatmap-${i}-${j}`} x={timeScale(d.timestamp)} y={height - valueScale(item.bitIndex)} height={rectHeight} width={barWidth} fill={colors[j].color} opacity={colors[j].opacity} />
                        )
                    })
                })
            }
            </>
        )
    }