import { ChartType, TimelineCategoricalPoint, TimelineNumericalPoint } from "@/types/chart";
import { useNumericalPlotState } from "./useNumericalPlotState";
import { useCategoricalPlotState } from "./useCategoricalPlotState";

export function useVaryingPlotState(
    data: (TimelineNumericalPoint | TimelineCategoricalPoint)[],
    chartType: ChartType,
    bucketSize: number,
    fieldId: number,
) {
    // Numerical chart state
    const { minValue: numericalMinValue, maxValue: numericalMaxValue, getTooltipData: numericalGetTooltipData } = useNumericalPlotState(
        chartType === 'numerical' ? (data as TimelineNumericalPoint[]) : [],
        bucketSize
    );

    // Categorical chart state
    const { maxValue: categoricalMaxValue, getTooltipData: categoricalGetTooltipData } = useCategoricalPlotState(
        chartType === 'categorical' ? (data as TimelineCategoricalPoint[]) : [],
        bucketSize,
        fieldId
    );


    if (chartType === 'numerical') {
        return {
            minValue: numericalMinValue,
            maxValue: numericalMaxValue,
            getTooltipData: numericalGetTooltipData,
        }
    } else {
        return {
            minValue: 0,
            maxValue: categoricalMaxValue,
            getTooltipData: categoricalGetTooltipData,
        }
    }
}