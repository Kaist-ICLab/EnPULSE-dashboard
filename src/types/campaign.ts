import { FetchedSurvey, Survey } from "./survey";
import { CampaignTrigger, FetchedCampaignTrigger } from "./trigger";
import { Constants, Database } from "@/lib/schema";
import { DeepRequired } from "@/utils/type";

export type FieldType = Database['public']['Enums']['field_type'];
export type FieldRole = Database['public']['Enums']['field_role'];
export const FieldRoleOption: readonly FieldRole[] = Constants.public.Enums.field_role;
export const FieldTypeOption: readonly FieldType[] = Constants.public.Enums.field_type;

export type Campaign = Database['public']['Tables']['campaigns']['Insert'] & {
    profiles: CampaignParticipant[];
    campaign_table: CampaignTable[];
    survey: Survey[];
    campaign_trigger: CampaignTrigger[];
}

export type FetchedCampaign = DeepRequired<Omit<Campaign, 'survey' | 'campaign_trigger'>> & {
    survey: FetchedSurvey[];
    campaign_trigger: FetchedCampaignTrigger[];
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
    campaign_trigger: number[];
}