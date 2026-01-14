import { ScaleLinear, ScaleTime } from "@visx/vendor/d3-scale";

export enum SectionType {
    TimelineOverview = "timeline-overview",
    IntraPerson = "intra-person",
    InterPerson = "inter-person"
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
    value: { category: string, count: number }[];
}

export type TimelineDataPoint = TimelineNumericalPoint | TimelineCategoricalPoint;

export interface TimelineData {
    id: string;
    title: string;
    table: string;
    column: string;
    chartType: ChartType;
    params: ChartParams;
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

export type ChartParams = {
    uuid: string,
    fieldId: number,
    date: Date,
}

export type ChartPinQuery = {
    [SectionType.IntraPerson]: { date: Date } | null;
    [SectionType.InterPerson]: { uuid: string } | null;
    [SectionType.TimelineOverview]: { fieldId: number } | null;
};

export type ChartPinQueryOption = { date: Date } | { uuid: string } | { fieldId: number } | null

export type TooltipData = { label: string, value: string }[] | null