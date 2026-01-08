import { ChartType, TimelineChartGraphProps, TimelineDataPoint, TimelineNumericalPoint, TimelineCategoricalPoint } from "@/types/chart";
import { NumericalTimelineGraph } from "./NumericalTimelineGraph";
import { CategoricalTimelineGraph } from "./CategoricalTimelineGraph";

interface TimelineGraphProps extends TimelineChartGraphProps<TimelineDataPoint> {
    chartType: ChartType;
}

export const TimelineGraph: React.FC<TimelineGraphProps> = ({
    chartType, data, height, timeScale, valueScale, barWidth, getCategoryColor
}) => {
    if (chartType === 'numerical') {
        return <NumericalTimelineGraph
            data={data as TimelineNumericalPoint[]}
            height={height}
            timeScale={timeScale}
            valueScale={valueScale}
            barWidth={barWidth}
        />
    } else {
        return <CategoricalTimelineGraph
            data={data as TimelineCategoricalPoint[]}
            height={height}
            timeScale={timeScale}
            valueScale={valueScale}
            barWidth={barWidth}
            getCategoryColor={getCategoryColor}
        />
    }
}