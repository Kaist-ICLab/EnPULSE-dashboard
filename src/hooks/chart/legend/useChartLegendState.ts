import { ChartType, TimelineCategoricalPoint, TimelineDataPoint } from "@/types/chart";
import { useCategoricalChartLegendState } from "./useCategoricalChartLegendState";
import { gray } from "@/utils/timelineUtils";

export function useChartLegendState(chartType: ChartType, data: TimelineDataPoint[]) {
    const { getCategoryColor, uniqueCategories, handleLegendClick } = useCategoricalChartLegendState(chartType === 'categorical' ? (data as TimelineCategoricalPoint[]) : []);

    if (chartType === 'categorical') {
        return {
            getCategoryColor,
            uniqueCategories,
            handleLegendClick,
        }
    } else {
        return {
            getCategoryColor: () => gray,
            uniqueCategories: [],
            handleLegendClick: () => { },
        }
    }
}