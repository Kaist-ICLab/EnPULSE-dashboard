export enum ComparisonType {
    Sensors = "sensors",
    Days = "days",
    Participants = "participants"
}

export type ComparisonParams = { uuid: string[]; fieldId: number[]; questionId: number[]; };

export type ChartPinQuery = {
    date: Date | null;
    uuid: string | null;
    fieldId: number | null;
    questionId: number | null;
};

export type ChartPinQueryOption = { date: Date; } | { uuid: string; } | { fieldId: number; } | { questionId: number; } | null;

export type UserDailyStatData = {
    uuid: string,
    contacts: number,
    tables: { table_id: number, totalCount: number, counts: number[] }[],
    surveys: { survey_id: number, totalCount: number, counts: number[] }[],
}
