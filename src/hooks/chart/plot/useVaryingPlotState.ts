import { ChartType, TimelineCategoricalPoint, TimelineDataPoint, TimelineHeatmapPoint, TimelineNumericalPoint, TimelineSurveyEventPoint } from "@/types/chart";
import { useNumericalPlotState } from "./useNumericalPlotState";
import { useCategoricalPlotState } from "./useCategoricalPlotState";
import { useBarcodePlotState } from "./useBarcodePlotState";
import { useHeatmapPlotState } from "./useHeatmapPlotState";
import { useSurveyEventsPlotState } from "./useSurveyEventsPlotState";
import { colors } from "@/utils/timelineUtils";

export function useVaryingPlotState(
    data: TimelineDataPoint[],
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

    const { getTooltipData: barcodeGetTooltipData, getColor: barcodeGetColor } = useBarcodePlotState(
        chartType === 'barcode' ? (data as TimelineCategoricalPoint[]) : [],
        bucketSize,
        fieldId
    );

    const { maxValue: heatmapMaxValue, getTooltipData: heatmapGetTooltipData, getColor: heatmapGetColor } = useHeatmapPlotState(
        chartType === 'heatmap' ? (data as TimelineHeatmapPoint[]) : [],
        bucketSize,
        fieldId
    );

    const { getTooltipData: surveyEventsGetTooltipData, getColor: surveyEventsGetColor } = useSurveyEventsPlotState(
        chartType === 'survey_events' ? (data as TimelineSurveyEventPoint[]) : []
    );

    if (chartType === 'numerical') {
        return {
            minValue: numericalMinValue,
            maxValue: numericalMaxValue,
            getTooltipData: numericalGetTooltipData,
            getColor: () => ([{ color: colors[0], opacity: 1 }])
        }
    } else if (chartType === 'categorical') {
        return {
            minValue: 0,
            maxValue: categoricalMaxValue,
            getTooltipData: categoricalGetTooltipData,
            getColor: () => ([{ color: colors[0], opacity: 1 }])
        }
    } else if (chartType === 'barcode') {
        return {
            minValue: 0,
            maxValue: 1,
            getTooltipData: barcodeGetTooltipData,
            getColor: barcodeGetColor
        }
    } else if (chartType === 'heatmap') {
        return {
            minValue: 0,
            maxValue: heatmapMaxValue,
            getTooltipData: heatmapGetTooltipData,
            getColor: heatmapGetColor,
        }
    } else if (chartType === 'survey_events') {
        return {
            minValue: 0,
            maxValue: 1,
            getTooltipData: surveyEventsGetTooltipData,
            getColor: surveyEventsGetColor,
        }
    } else {
        return {
            minValue: 0,
            maxValue: 0,
            getTooltipData: () => null,
            getColor: () => ([{ color: colors[0], opacity: 1 }])
        }
    }
}
