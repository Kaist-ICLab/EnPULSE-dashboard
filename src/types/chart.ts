export enum SectionType {
    TimelineOverview = "timeline-overview",
    IntraPerson = "intra-person",
    InterPerson = "inter-person"
}

export type ChartType = "numerical" | "categorical"

export interface TimelineNumericalValue {
    avg: number;
    min: number;
    max: number;
}

export interface TimelineCategoricalValue {
    value: string;
    count: number;
}

export interface TimelineData {
    id: string;
    title: string;
    table: string;
    column: string;
    chartType: ChartType;
    params: ChartParams;
    timestamp: number[];
    value: (TimelineNumericalValue | TimelineCategoricalValue)[];
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