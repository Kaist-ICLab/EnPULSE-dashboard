import { FetchedSurvey, Survey } from "./survey";
import { CampaignTrigger, FetchedCampaignTrigger } from "./trigger";
import { Constants, Database, Json } from "@/lib/schema";
import { DeepRequired } from "@/utils/type";

export type FieldType = Database["public"]["Enums"]["field_type"];
export type FieldRole = Database["public"]["Enums"]["field_role"];
export const FieldRoleOption: readonly FieldRole[] = Constants.public.Enums.field_role;
export const FieldTypeOption: readonly FieldType[] = Constants.public.Enums.field_type;

export type CampaignListItem = {
  id: number;
  name: string;
  description: string;
  start_time: string;
  end_time: string;
};

export type Campaign = Database["public"]["Tables"]["campaigns"]["Insert"] & {
  profiles: CampaignParticipant[];
  campaign_table: CampaignTable[];
  survey: Survey[];
  campaign_trigger: CampaignTrigger[];
  campaign_webapp: CampaignWebapp[];
};

export type FetchedCampaign = DeepRequired<Omit<Campaign, "survey" | "campaign_trigger" | "campaign_table">> & {
  survey: FetchedSurvey[];
  campaign_trigger: FetchedCampaignTrigger[];
  campaign_table: FetchedCampaignTable[];
};

export type CampaignTable = Database["public"]["Tables"]["campaign_table"]["Insert"] & {
  campaign_table_field: CampaignTableField[];
};

// `config` is a generic, sensor-defined `Json` blob (see src/types/timingSchedule.ts for the
// timing_sensor interpretation of it) — its recursive index-signature shape makes `DeepRequired`
// blow up ("Type instantiation is excessively deep") if it's left inside the `DeepRequired` call
// above, the same reason `survey`/`campaign_trigger` (which also carry raw `Json` columns) are
// excluded from it and given their own narrowed `Fetched*` type instead.
export type FetchedCampaignTable = DeepRequired<Omit<CampaignTable, "config">> & {
  config: Json | null;
};

export type CampaignTableField = Database["public"]["Tables"]["campaign_table_field"]["Insert"] & {
  campaign_table_field_mapping: CampaignTableFieldMapping[];
};

export type CampaignTableFieldMapping = Database["public"]["Tables"]["campaign_table_field_mapping"]["Insert"];

export type CampaignParticipant = Database["public"]["Tables"]["profiles"]["Insert"];

export type CampaignWebapp = Database["public"]["Tables"]["campaign_webapp"]["Insert"];

export type RemovedEntries = {
  table: number[];
  field: number[];
  mapping: number[];
  survey: number[];
  question: number[];
  trigger: number[];
  campaign_trigger: number[];
  webapp: number[];
};
