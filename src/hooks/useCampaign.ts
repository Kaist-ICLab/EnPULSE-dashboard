import { create } from 'zustand';
import { Campaign, CampaignTable, CampaignTableField, CampaignParticipant } from '@/types/campaign';
import { getCampaignParticipants, getCampaigns, getCampaignTableFields, getCampaignTables, updateCampaignName, updateCampaignTable, updateCampaignTableFields } from '@/services/campaignService';

export type ResponseStatus = 'loading' | 'ok' | 'error';
interface Response {
    status: ResponseStatus,
    message: string | null,
}

interface CampaignState {
    campaigns: Map<number, Campaign>;
    campaignTables: Map<number, CampaignTable>;
    campaignTableFields: Map<number, CampaignTableField>;
    campaignParticipants: Map<string, CampaignParticipant>;
    selectedCampaignId: number | null;
    responses: {
        fetchCampaigns: Response,
        selectCampaign: Response,
        updateCampaignName: Response,
    }
    fetchCampaigns: () => Promise<void>;
    setCampaigns: (campaigns: Map<number, Campaign>) => void;
    selectCampaign: (campaignId: number) => Promise<void>;
    updateCampaignName: (campaignId: number, name: string) => Promise<void>;
    updateCampaignTable: (tableId: number, dailyCountMax: number) => Promise<void>;
    updateCampaignField: (changes: Partial<CampaignTableField>[]) => Promise<void>;
}


const useCampaign = create<CampaignState>((set, get) => ({
    campaigns: new Map(),
    campaignTables: new Map(),
    campaignTableFields: new Map(),
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
            const campaigns = await getCampaigns();
            set((state) => ({
                responses: { ...state.responses, fetchCampaigns: { status: 'ok', message: null } },
                campaigns: new Map(campaigns.map(campaign => [campaign.id, campaign]))
            }));
        } catch {
            set((state) => ({ responses: { ...state.responses, fetchCampaigns: { status: 'error', message: "Error fetching campaigns" } } }));
        }
    },
    setCampaigns: (campaigns: Map<number, Campaign>) => {
        set({ campaigns });
    },
    selectCampaign: async (campaignId: number) => {
        try {
            if (get().selectedCampaignId === campaignId) return;
            set((state) => ({ responses: { ...state.responses, selectCampaign: { status: 'loading', message: "Selecting campaign..." } } }));

            const campaignTables = await getCampaignTables(campaignId);
            const campaignTableFields = (await Promise.all(campaignTables.map(async (campaignTable) => {
                return await getCampaignTableFields(campaignId, campaignTable.id);
            }))).flat();
            const campaignParticipants = await getCampaignParticipants(campaignId);

            set({
                campaignTables: new Map(campaignTables.map(campaignTable => [campaignTable.id, campaignTable])),
                campaignTableFields: new Map(campaignTableFields.map(campaignTableField => [campaignTableField.id, campaignTableField])),
                selectedCampaignId: campaignId,
                campaignParticipants: new Map(campaignParticipants.map(campaignParticipant => [campaignParticipant.uuid, campaignParticipant])),
                responses: { ...get().responses, selectCampaign: { status: 'ok', message: "Campaign selected" } }
            });
        } catch (error) {
            console.error(error);
            set((state) => ({ responses: { ...state.responses, selectCampaign: { status: 'error', message: "Error selecting campaign" } } }));
        }
    },
    updateCampaignName: async (campaignId: number, name: string) => {
        try {
            set((state) => ({ responses: { ...state.responses, updateCampaignName: { status: 'loading', message: "Updating campaign name..." } } }));
            await updateCampaignName(campaignId, name);
            set((state) => ({
                responses: { ...state.responses, updateCampaignName: { status: 'ok', message: null } },
                campaigns: new Map(state.campaigns.set(campaignId, { ...state.campaigns.get(campaignId)!, name }))
            }));
        } catch {
            set((state) => ({ responses: { ...state.responses, updateCampaignName: { status: 'error', message: "Error updating campaign name" } } }));
        }
    },
    updateCampaignTable: async (tableId: number, dailyCountMax: number) => {
        try {
            set((state) => ({ responses: { ...state.responses, updateCampaignTable: { status: 'loading', message: "Updating campaign table..." } } }));
            await updateCampaignTable(tableId, dailyCountMax);
            set((state) => ({
                campaignTables: new Map(state.campaignTables.set(tableId, { ...state.campaignTables.get(tableId)!, daily_count_max: dailyCountMax })),
                responses: { ...state.responses, updateCampaignTable: { status: 'ok', message: null } },
            }));
        } catch {
            set((state) => ({
                responses: {
                    ...state.responses,
                    updateCampaignTable: { status: 'error', message: "Error updating campaign table" }
                }
            }));
        }
    },
    updateCampaignField: async (changes: Partial<CampaignTableField>[]) => {
        try {
            set((state) => ({ responses: { ...state.responses, updateCampaignField: { status: 'loading', message: "Updating campaign field..." } } }));
            await updateCampaignTableFields(changes);
            set((state) => ({
                campaignTableFields: new Map(Array.from(state.campaignTableFields.entries()).map(([id, campaignTableField]: [number, CampaignTableField]) => {
                    const change = changes.find(change => change.id === id);
                    if (change) {
                        return [id, { ...campaignTableField, ...change }];
                    }
                    return [id, campaignTableField];
                })),
                responses: { ...state.responses, updateCampaignField: { status: 'ok', message: null } },
            }));
        } catch {
            set((state) => ({
                responses: { ...state.responses, updateCampaignField: { status: 'error', message: "Error updating campaign field" } }
            }));
        }
    },
}));

export default useCampaign;