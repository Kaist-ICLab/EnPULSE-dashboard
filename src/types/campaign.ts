import { Survey } from "./survey";
import { Database } from "@/lib/schema";

export type FieldType = 'categorical' | 'numerical' | 'datetime';
export type FieldRole = 'uid' | 'timestamp' | 'data' | 'ignore';
export const FieldRoleOption: FieldRole[] = ['uid', 'timestamp', 'data', 'ignore'];
export const FieldTypeOption: FieldType[] = ['categorical', 'numerical', 'datetime'];

export type Campaign = Database['public']['Tables']['campaigns']['Insert'] & {
    profiles: CampaignParticipant[];
    campaign_table: CampaignTable[];
    survey: Survey[];
}

export type CampaignTable = Database['public']['Tables']['campaign_table']['Insert'] & {
    campaign_table_field: CampaignTableField[];
}

export type CampaignTableField = Database['public']['Tables']['campaign_table_field']['Insert'] & {
    campaign_table_field_mapping: CampaignTableFieldMapping[];
}

export type CampaignTableFieldMapping = Database['public']['Tables']['campaign_table_field_mapping']['Insert']

export type CampaignParticipant = Database['public']['Tables']['profiles']['Insert']