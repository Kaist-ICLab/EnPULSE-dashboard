import { ScaleLinear, ScaleTime } from "@visx/vendor/d3-scale";

export enum ComparisonType {
    Sensors = "sensors",
    Days = "days",
    Participants = "participants"
}

export type ChartType = "numerical" | "categorical"

export interface TimelineNumericalPoint {
    timestamp: number;
    avg: number;
    min: number;
    max: number;
}

export interface TimelineCategoricalPoint {
    timestamp: number;
    value: { category: string, count: number, aggregated: number }[];
}

export type TimelineDataPoint = TimelineNumericalPoint | TimelineCategoricalPoint;

export interface TimelineData {
    id: string;
    title: string;
    table: string;
    column: string;
    chartType: ChartType;
    params: TimelineParams;
    value: (TimelineNumericalPoint | TimelineCategoricalPoint)[];
}

export interface TimelineChartGraphProps<T extends TimelineDataPoint> {
    data: T[];
    height: number;
    timeScale: ScaleTime<number, number, never>;
    valueScale: ScaleLinear<number, number, never>;
    barWidth: number;
    getCategoryColor?: (category: string) => string;
}

export type TimelineParams = {
    uuid: string,
    fieldId: number,
    date: Date,
}

export type ChartPinQuery = {
    date: Date | null,
    uuid: string | null,
    fieldId: number | null,
};

export type ChartPinQueryOption = { date: Date } | { uuid: string } | { fieldId: number } | null

export type TooltipData = { label: string, value: string }[] | null