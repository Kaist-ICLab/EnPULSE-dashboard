export enum ChartType {
    TimelineOverview = "timeline-overview",
    IntraPerson = "intra-person",
    InterPerson = "inter-person"
}

export interface TimelineData {
    id: string;
    title: string;
    table: string;
    column: string;
    chartType: 'numerical' | 'categorical';
    params: ChartParams;
    timestamp: number[];
    value: (string | number)[];
}

export type ChartParams = {
    uuid: string,
    sid: number,
    date: Date,
}

export type PinQuery = {
    [ChartType.IntraPerson]: { date: Date } | null;
    [ChartType.InterPerson]: { uid: string } | null;
    [ChartType.TimelineOverview]: { sid: string } | null;
};