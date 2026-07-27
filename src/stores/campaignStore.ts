import { CampaignParticipant, CampaignTable, CampaignTableField, FetchedCampaign } from '@/types/campaign';
import { DeepRequired } from '@/utils/type';
import { create } from 'zustand';


export type CampaignState = {
    campaign?: FetchedCampaign;
    campaignTables: Map<number, DeepRequired<CampaignTable>>;
    campaignTableFields: Map<number, DeepRequired<CampaignTableField>>;
    campaignTableFieldMapping: Map<number, Map<string, string>>;
    campaignParticipants: Map<string, DeepRequired<CampaignParticipant>>;
    selectedCampaignId: number | null;
}

export type CampaignActions = {
    setCampaign: (campaign: FetchedCampaign) => void;
}

export type CampaignStore = CampaignState & CampaignActions;

export const defaultInitialState: CampaignState = {
    campaignTables: new Map(),
    campaignTableFields: new Map(),
    campaignTableFieldMapping: new Map(),
    campaignParticipants: new Map(),
    selectedCampaignId: null,
}

function generateCampaignStatesFromCampaign(campaign: FetchedCampaign) {
    const campaignTables = campaign.campaign_table
        .map((campaignTable) => ({
            ...campaignTable,
            campaign_table_field: campaignTable.campaign_table_field.filter((field) => field.field_role === "data")
        }));
    const campaignTableFields = campaignTables
        .flatMap((campaignTable) => campaignTable.campaign_table_field)
        .filter((field) => field.field_role === "data");

    return {
        campaign: campaign,
        campaignTables: new Map(campaignTables.sort((a, b) => a.id - b.id).map((campaignTable) => [campaignTable.id, campaignTable])),
        campaignTableFields: new Map(campaignTableFields.sort((a, b) => a.id - b.id).map((campaignTableField) => [campaignTableField.id, campaignTableField])),
        campaignTableFieldMapping: new Map(campaignTableFields.map((field) => [field.id, new Map(field.campaign_table_field_mapping.map((mapping) => [mapping.value, mapping.display]))])),
        campaignParticipants: new Map(campaign.profiles.map((campaignParticipant) => [campaignParticipant.uuid, campaignParticipant])),
    };
}

export const createCampaignStore = (
    campaignId?: number,
    campaign?: FetchedCampaign,
) => {
    const others = campaign ? generateCampaignStatesFromCampaign(campaign) : {
        campaign: undefined,
        campaignTables: new Map<number, DeepRequired<CampaignTable>>(),
        campaignTableFields: new Map<number, DeepRequired<CampaignTableField>>(),
        campaignTableFieldMapping: new Map<number, Map<string, string>>(),
        campaignParticipants: new Map<string, DeepRequired<CampaignParticipant>>(),
    }

    return create<CampaignState & CampaignActions>((set) => ({
        ...others,
        selectedCampaignId: campaignId ?? null,
        setCampaign: (campaign: FetchedCampaign) => {
            set({
                ...generateCampaignStatesFromCampaign(campaign),
                selectedCampaignId: campaign.id,
            });
        },
    }));
}