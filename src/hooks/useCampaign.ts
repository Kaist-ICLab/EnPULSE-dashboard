import { create } from 'zustand';
import { Campaign, CampaignTable, CampaignTableField } from '@/types/campaign';
import { getCampaigns, updateCampaignName } from '@/services/campaignService';

export type ResponseStatus = 'loading' | 'ok' | 'error';
interface Response {
    status: ResponseStatus,
    message: string | null,
}

interface CampaignState {
    campaigns: Map<number, Campaign>;
    //   campaignTables: CampaignTable[];
    //   campaignTableFields: CampaignTableField[];
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
}


const useCampaign = create<CampaignState>((set) => ({
    campaigns: new Map(),
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
        } catch (error) {
            set((state) => ({ responses: { ...state.responses, fetchCampaigns: { status: 'error', message: "Error fetching campaigns" } } }));
        }
    },
    setCampaigns: (campaigns: Map<number, Campaign>) => {
        set({ campaigns });
    },
    selectCampaign: async (campaignId: number) => {
        set({ selectedCampaignId: campaignId });
    },
    updateCampaignName: async (campaignId: number, name: string) => {
        set((state) => ({ responses: { ...state.responses, updateCampaignName: { status: 'loading', message: "Updating campaign name..." } } }));
        await updateCampaignName(campaignId, name);
        set((state) => ({
            responses: { ...state.responses, updateCampaignName: { status: 'ok', message: null } },
            campaigns: new Map(state.campaigns.set(campaignId, { ...state.campaigns.get(campaignId)!, name }))
        }));
    },
}));

export default useCampaign;