import { create } from 'zustand';
import { CampaignTable, CampaignTableField, CampaignParticipant, FetchedCampaign } from '@/types/campaign';
import { getCampaignList, getCampaignInfo } from '@/services/campaignService';
import { DeepRequired } from '@/utils/type';

export type ResponseStatus = 'loading' | 'ok' | 'error';
interface Response {
    status: ResponseStatus,
    message: string | null,
}

interface CampaignState {
    campaign?: FetchedCampaign;
    campaignList: Map<number, string>;
    campaignTables: Map<number, DeepRequired<CampaignTable>>;
    campaignTableFields: Map<number, DeepRequired<CampaignTableField>>;
    campaignTableFieldMapping: Map<number, Map<string, string>>;
    campaignParticipants: Map<string, DeepRequired<CampaignParticipant>>;
    selectedCampaignId: number | null;
    responses: {
        fetchCampaigns: Response,
        selectCampaign: Response,
        updateCampaignName: Response,
    }
    fetchCampaigns: () => Promise<void>;
    setCampaignList: (campaigns: Map<number, string>) => void;
    selectCampaign: (campaignId: number) => Promise<void>;
    updateCampaignName: (campaignId: number, name: string) => Promise<void>;
}


const useCampaign = create<CampaignState>((set, get) => ({
    campaignList: new Map(),
    campaignTables: new Map(),
    campaignTableFields: new Map(),
    campaignTableFieldMapping: new Map(),
    campaignParticipants: new Map(),
    selectedCampaignId: null,
    responses: {
        fetchCampaigns: {
            status: 'ok',
            message: null,
        },
        selectCampaign: {
            status: 'ok',
            message: null,
        },
        updateCampaignName: {
            status: 'ok',
            message: null,
        },
    },
    fetchCampaigns: async () => {
        try {
            set((state) => ({ responses: { ...state.responses, fetchCampaigns: { status: 'loading', message: "Fetching campaigns..." } } }));
            const campaigns = await getCampaignList();
            set((state) => ({
                responses: { ...state.responses, fetchCampaigns: { status: 'ok', message: null } },
                campaignList: new Map(campaigns.map(campaign => [campaign.id, campaign.name]))
            }));
        } catch (error) {
            console.log(error)
            set((state) => ({ responses: { ...state.responses, fetchCampaigns: { status: 'error', message: "Error fetching campaigns" } } }));
        }
    },
    setCampaignList: (campaigns: Map<number, string>) => {
        set({ campaignList: campaigns });
    },
    selectCampaign: async (campaignId: number) => {
        try {
            if (get().selectedCampaignId === campaignId) return;
            set((state) => ({ responses: { ...state.responses, selectCampaign: { status: 'loading', message: "Selecting campaign..." } } }));

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
                responses: { ...get().responses, selectCampaign: { status: 'ok', message: "Campaign selected" } }
            });

        } catch (error) {
            console.error(error);
            set((state) => ({ responses: { ...state.responses, selectCampaign: { status: 'error', message: "Error selecting campaign" } } }));
        }
    },

    /* **********
     * This feature will be move to useCampaignConfigEdit
     ********** */
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateCampaignName: async (campaignId: number, name: string) => {
    },
}));

export default useCampaign;