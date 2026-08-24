import { ScaleLinear, ScaleTime } from "@visx/vendor/d3-scale";

export type ChartType = "numerical" | "categorical" | "barcode" | "heatmap" | "survey_events";

export interface TimelineNumericalPoint {
  timestamp: number;
  avg: number;
  min: number;
  max: number;
}

export interface TimelineCategoricalPoint {
  timestamp: number;
  value: { category: string; count: number; aggregated: number }[];
}

export interface TimelineHeatmapPoint {
  timestamp: number;
  value: { bitIndex: number; count: number }[];
}

// One survey response event. Several events (possibly from different questions)
// share the same chart, with one row per questionId. `rawResponse` is preserved
// for downstream distribution analysis.
export type SurveyAnswerType = "checkbox" | "radio" | "text" | "number" | "binary" | "numberscale";

export interface TimelineSurveyEventPoint {
  timestamp: number;
  questionId: number;
  questionTitle: string;
  answerType: SurveyAnswerType;
  response: string;
  rawResponse: unknown;
}

export type TimelineDataPoint =
  TimelineNumericalPoint | TimelineCategoricalPoint | TimelineHeatmapPoint | TimelineSurveyEventPoint;

export interface TimelineData {
  id: string;
  title: string;
  chartType: ChartType;
  params: TimelineParams;
  value: TimelineDataPoint[];
}

export interface TimelinePlotProps<T extends TimelineDataPoint> {
  data: T[];
  height: number;
  timeScale: ScaleTime<number, number, never>;
  valueScale: ScaleLinear<number, number, never>;
  barWidth: number;
  getCategoryColor?: (category: string) => string;
}

export type TimelineParams = {
  uuid: string;
  fieldId: number;
  questionId?: number;
  date: Date;
};

export type TooltipData = { label: string; value: string }[] | null;
