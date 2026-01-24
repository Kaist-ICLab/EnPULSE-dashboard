import { Survey } from "./survey";

export type FieldType = 'categorical' | 'numerical' | 'datetime';
export type FieldRole = 'uid' | 'timestamp' | 'data' | 'ignore';
export const FieldRoleOption: FieldRole[] = ['uid', 'timestamp', 'data', 'ignore'];
export const FieldTypeOption: FieldType[] = ['categorical', 'numerical', 'datetime'];

export interface Campaign {
    id: number;
    name: string;
    description?: string,
    start_time_of_day: number;
    end_time_of_day: number;
    profiles: CampaignParticipant[];
    campaign_table: CampaignTable[];
    survey: Survey[];
}

export interface CampaignTable {
    id: number;
    campaign_id: number;
    name: string;
    description?: string,
    daily_count_max: number;
    is_custom: boolean;
    campaign_table_field: CampaignTableField[];
}

export interface CampaignTableField {
    id: number;
    campaign_table_id: number;
    name: string;
    description?: string,
    field_type: FieldType;
    field_role: FieldRole;
    mapping?: { value: string, display: string }[];
}

export interface CampaignParticipant {
    uuid: string;
    email: string;
}