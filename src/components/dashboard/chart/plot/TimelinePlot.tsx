import { ChartType, TimelinePlotProps, TimelineDataPoint, TimelineNumericalPoint, TimelineCategoricalPoint } from "@/types/chart";
import { NumericalTimelinePlot } from "./NumericalTimelinePlot";
import { CategoricalTimelinePlot } from "./CategoricalTimelinePlot";
import { BarcodeTimelinePlot } from "./BarcodeTimelinePlot";

export const TimelinePlot: React.FC<TimelinePlotProps<TimelineDataPoint> & { chartType: ChartType, getColor: (point: TimelineCategoricalPoint) => { color: string, opacity: number } }> = ({
    chartType, data, height, timeScale, valueScale, barWidth, getCategoryColor, getColor
}) => {
    if (chartType === 'numerical') {
        return <NumericalTimelinePlot
            data={data as TimelineNumericalPoint[]}
            height={height}
            timeScale={timeScale}
            valueScale={valueScale}
            barWidth={barWidth}
        />
    } else if (chartType === 'categorical') {
        return <CategoricalTimelinePlot
            data={data as TimelineCategoricalPoint[]}
            height={height}
            timeScale={timeScale}
            valueScale={valueScale}
            barWidth={barWidth}
            getCategoryColor={getCategoryColor}
        />
    } else if (chartType === 'barcode') {
        return <BarcodeTimelinePlot
            data={data as TimelineCategoricalPoint[]}
            height={height}
            timeScale={timeScale}
            valueScale={valueScale}
            barWidth={barWidth}
            getColor={getColor}
        />
    }
}