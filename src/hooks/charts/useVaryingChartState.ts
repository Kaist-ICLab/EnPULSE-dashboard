import { ChartType, TimelineCategoricalPoint, TimelineNumericalPoint } from "@/types/chart";
import { useNumericalChartState } from "./useNumericalChartState";
import { useCategoricalChartState } from "./useCategoricalChartState";
import { useCategoricalChartLegend } from "./useCategoricalChartLegend";
import { gray } from "@/utils/timelineUtils";

export function useVaryingChartState(
    data: (TimelineNumericalPoint | TimelineCategoricalPoint)[],
    chartType: ChartType,
    bucketSize: number,
    fieldId: number,
) {
    // Numerical chart state
    const { minValue: numericalMinValue, maxValue: numericalMaxValue, getTooltipData: numericalGetTooltipData } = useNumericalChartState(
        chartType === 'numerical' ? (data as TimelineNumericalPoint[]) : [],
        bucketSize
    );

    // Categorical chart state
    const { maxValue: categoricalMaxValue, getTooltipData: categoricalGetTooltipData } = useCategoricalChartState(
        chartType === 'categorical' ? (data as TimelineCategoricalPoint[]) : [],
        bucketSize,
        fieldId
    );
    const { getCategoryColor, uniqueCategories, handleLegendClick } = useCategoricalChartLegend(chartType === 'categorical' ? (data as TimelineCategoricalPoint[]) : []);

    if (chartType === 'numerical') {
        return {
            minValue: numericalMinValue,
            maxValue: numericalMaxValue,
            getTooltipData: numericalGetTooltipData,
            getCategoryColor: () => gray,
            uniqueCategories: [],
            handleLegendClick: () => { },
        }
    } else {
        return {
            minValue: 0,
            maxValue: categoricalMaxValue,
            getTooltipData: categoricalGetTooltipData,
            getCategoryColor: getCategoryColor,
            uniqueCategories: uniqueCategories,
            handleLegendClick: handleLegendClick,
        }
    }
}