import { create } from 'zustand';
import { CampaignTable, CampaignTableField, CampaignParticipant, FetchedCampaign } from '@/types/campaign';
import { getCampaignList, getCampaignInfo } from '@/services/campaignService';
import { DeepRequired } from '@/utils/type';


interface CampaignState {
    campaign?: FetchedCampaign;
    campaignList: Map<number, {
        name: string;
        description: string;
        start_time: string;
        end_time: string;
    }>;
    campaignTables: Map<number, DeepRequired<CampaignTable>>;
    campaignTableFields: Map<number, DeepRequired<CampaignTableField>>;
    campaignTableFieldMapping: Map<number, Map<string, string>>;
    campaignParticipants: Map<string, DeepRequired<CampaignParticipant>>;
    selectedCampaignId: number | null;
    fetchCampaigns: () => Promise<void>;
    setCampaignList: (campaigns: Map<number, { name: string, description: string, start_time: string, end_time: string }>) => void;
    selectCampaign: (campaignId: number, force?: boolean) => Promise<void>;
}


const useCampaign = create<CampaignState>((set, get) => ({
    campaignList: new Map(),
    campaignTables: new Map(),
    campaignTableFields: new Map(),
    campaignTableFieldMapping: new Map(),
    campaignParticipants: new Map(),
    selectedCampaignId: null,
    fetchCampaigns: async () => {
        try {
            const campaigns = await getCampaignList();
            set({ campaignList: new Map(campaigns.map(({ id, ...others }) => [id, { ...others }])) });
        } catch (error) {
            console.log(error)
        }
    },
    setCampaignList: (campaigns: Map<number, { name: string, description: string, start_time: string, end_time: string }>) => {
        set({ campaignList: campaigns });
    },
    selectCampaign: async (campaignId: number, force = false) => {
        try {
            if (!force && get().selectedCampaignId === campaignId) return;

            const campaign = await getCampaignInfo(campaignId);
            const campaignTables = campaign.campaign_table.map(campaignTable => ({ ...campaignTable, campaign_table_field: campaignTable.campaign_table_field.filter(field => field.field_role == "data") }));
            const campaignTableFields = campaignTables.flatMap(campaignTable => campaignTable.campaign_table_field).filter(field => field.field_role == "data");
            const campaignTableFieldMappings = campaignTableFields.map(field => [field.id, new Map(field.campaign_table_field_mapping.map(mapping => [mapping.value, mapping.display]))]) as [number, Map<string, string>][];
            const campaignParticipants = campaign.profiles;

            const tablesMap = new Map(campaignTables.sort((a, b) => a.id - b.id).map(campaignTable => [campaignTable.id, campaignTable]));
            const fieldsMap = new Map(campaignTableFields.sort((a, b) => a.id - b.id).map(campaignTableField => [campaignTableField.id, campaignTableField]));
            const mappingMap = new Map(campaignTableFieldMappings); // We don't care about the order of the mapping

            set({
                campaign: campaign,
                campaignTables: tablesMap,
                campaignTableFields: fieldsMap,
                campaignTableFieldMapping: mappingMap,
                campaignParticipants: new Map(campaignParticipants.map(campaignParticipant => [campaignParticipant.uuid, campaignParticipant])),
                selectedCampaignId: campaignId,
            });

        } catch (error) {
            console.error(error);
        }
    },
}));

export default useCampaign;