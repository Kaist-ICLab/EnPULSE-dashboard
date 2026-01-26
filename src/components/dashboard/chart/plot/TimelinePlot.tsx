import { ChartType, TimelinePlotProps, TimelineDataPoint, TimelineNumericalPoint, TimelineCategoricalPoint } from "@/types/chart";
import { NumericalTimelinePlot } from "./NumericalTimelinePlot";
import { CategoricalTimelinePlot } from "./CategoricalTimelinePlot";

export const TimelinePlot: React.FC<TimelinePlotProps<TimelineDataPoint> & { chartType: ChartType }> = ({
    chartType, data, height, timeScale, valueScale, barWidth, getCategoryColor
}) => {
    if (chartType === 'numerical') {
        return <NumericalTimelinePlot
            data={data as TimelineNumericalPoint[]}
            height={height}
            timeScale={timeScale}
            valueScale={valueScale}
            barWidth={barWidth}
        />
    } else {
        return <CategoricalTimelinePlot
            data={data as TimelineCategoricalPoint[]}
            height={height}
            timeScale={timeScale}
            valueScale={valueScale}
            barWidth={barWidth}
            getCategoryColor={getCategoryColor}
        />
    }
}