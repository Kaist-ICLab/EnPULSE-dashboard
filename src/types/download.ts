export type DownloadTable = {
    name: string;
    fieldNames: string[];
};

export type DownloadRecord = {
    participant_uuid: string;
    participant_email: string;
    sensor_table: string;
    sensor_field: string;
    timestamp: string;
    value: string;
};

export type DownloadFileRow = {
    table: string;
    uuid: string;
    email: string;
    date: Date;
    count: number;
};