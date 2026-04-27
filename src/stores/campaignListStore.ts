import { CampaignListItem } from '@/types/campaign';
import { create } from 'zustand';

export type CampaignListState = {
    campaignList: Map<number, CampaignListItem>;
}

export type CampaignListActions = {
    setCampaignList: (campaignList: Map<number, CampaignListItem>) => void;
}

export type CampaignListStore = CampaignListState & CampaignListActions;

export const createCampaignListStore = (
    campaignList: Map<number, CampaignListItem> = new Map(),
) => {
    return create<CampaignListStore>((set) => ({
        campaignList: campaignList,
        setCampaignList: (campaignList: Map<number, CampaignListItem>) => {
            set({ campaignList: campaignList });
        },
    }));
}