
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
    uid: string,
    sid: string,
    date: Date,
}