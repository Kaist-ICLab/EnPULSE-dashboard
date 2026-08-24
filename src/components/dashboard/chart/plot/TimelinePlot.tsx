import {
  ChartType,
  TimelinePlotProps,
  TimelineDataPoint,
  TimelineNumericalPoint,
  TimelineCategoricalPoint,
  TimelineHeatmapPoint,
  TimelineSurveyEventPoint,
} from "@/types/chart";
import { NumericalTimelinePlot } from "./NumericalTimelinePlot";
import { CategoricalTimelinePlot } from "./CategoricalTimelinePlot";
import { BarcodeTimelinePlot } from "./BarcodeTimelinePlot";
import { HeatmapTimelinePlot } from "./HeatmapTimelinePlot";
import { SurveyEventsTimelinePlot } from "./SurveyEventsTimelinePlot";

export const TimelinePlot: React.FC<
  TimelinePlotProps<TimelineDataPoint> & {
    chartType: ChartType;
    getColor: (point: TimelineDataPoint) => { color: string; opacity: number }[];
  }
> = ({ chartType, data, height, timeScale, valueScale, barWidth, getCategoryColor, getColor }) => {
  if (chartType === "numerical") {
    return (
      <NumericalTimelinePlot
        data={data as TimelineNumericalPoint[]}
        height={height}
        timeScale={timeScale}
        valueScale={valueScale}
        barWidth={barWidth}
      />
    );
  } else if (chartType === "categorical") {
    return (
      <CategoricalTimelinePlot
        data={data as TimelineCategoricalPoint[]}
        height={height}
        timeScale={timeScale}
        valueScale={valueScale}
        barWidth={barWidth}
        getCategoryColor={getCategoryColor}
      />
    );
  } else if (chartType === "barcode") {
    return (
      <BarcodeTimelinePlot
        data={data as TimelineCategoricalPoint[]}
        height={height}
        timeScale={timeScale}
        valueScale={valueScale}
        barWidth={barWidth}
        getColor={getColor}
      />
    );
  } else if (chartType === "heatmap") {
    return (
      <HeatmapTimelinePlot
        data={data as TimelineHeatmapPoint[]}
        height={height}
        timeScale={timeScale}
        valueScale={valueScale}
        barWidth={barWidth}
        getColor={getColor}
      />
    );
  } else if (chartType === "survey_events") {
    return (
      <SurveyEventsTimelinePlot
        data={data as TimelineSurveyEventPoint[]}
        height={height}
        timeScale={timeScale}
        valueScale={valueScale}
        barWidth={barWidth}
        getColor={getColor}
      />
    );
  }
  return null;
};
