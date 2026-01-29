import { FetchedSurvey, Survey } from "./survey";
import { Database } from "@/lib/schema";
import { DeepRequired } from "@/utils/type";

export type FieldType = Database['public']['Enums']['field_type'];
export type FieldRole = Database['public']['Enums']['field_role'];
export const FieldRoleOption: FieldRole[] = ['uid', 'timestamp', 'data', 'ignore'];
export const FieldTypeOption: FieldType[] = ['categorical', 'numerical', 'datetime', 'text'];

export type Campaign = Database['public']['Tables']['campaigns']['Insert'] & {
    profiles: CampaignParticipant[];
    campaign_table: CampaignTable[];
    survey: Survey[];
}

export type FetchedCampaign = DeepRequired<Omit<Campaign, 'survey'>> & {
    survey: FetchedSurvey[];
}

export type CampaignTable = Database['public']['Tables']['campaign_table']['Insert'] & {
    campaign_table_field: CampaignTableField[];
}

export type CampaignTableField = Database['public']['Tables']['campaign_table_field']['Insert'] & {
    campaign_table_field_mapping: CampaignTableFieldMapping[];
}

export type CampaignTableFieldMapping = Database['public']['Tables']['campaign_table_field_mapping']['Insert']

export type CampaignParticipant = Database['public']['Tables']['profiles']['Insert']

export type RemovedEntries = {
    table: number[];
    field: number[];
    mapping: number[];
    survey: number[];
    question: number[];
    option: number[];
    trigger: number[];
}