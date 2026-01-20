export type FieldType = 'categorical' | 'numerical' | 'timedelta' | 'datetime';
export type FieldRole = 'uid' | 'timestamp' | 'data' | 'ignore';
export const FieldRoleOption: FieldRole[] = ['uid', 'timestamp', 'data', 'ignore'];
export const FieldTypeOption: FieldType[] = ['categorical', 'numerical', 'timedelta', 'datetime'];

export interface Campaign {
    id: number;
    name: string;
}

export interface CampaignTable {
    id: number;
    campaign_id: number;
    name: string;
    description?: string,
    daily_count_max: number;
}

export interface CampaignTableField {
    id: number;
    campaign_id: number;
    campaign_table_id: number;
    name: string;
    description?: string,
    field_type: FieldType;
    field_role: FieldRole;
}

export interface CampaignParticipant {
    uuid: string;
    email: string;
}

export interface CampaignTableFieldWithTable extends CampaignTableField {
    table_id: number;
    table_name: string;
    display_name: string;
}

