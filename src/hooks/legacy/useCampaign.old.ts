// // stores/campaignStore.ts
// import {
//     createCampaign,
//     getCampaignDetail,
//     getCampaigns,
//     updateCampaignField,
//     updateCampaignName,
//     updateCampaignTable
// } from '@/services/campaignService';
// import { Campaign, CampaignTable, CampaignTableField } from '@/types/campaign';
// import { create } from 'zustand';

// interface CampaignState {
//     campaigns: Campaign[];
//     campaignTables: CampaignTable[];
//     campaignFields: CampaignTableField[];
//     selectedCampaign: Campaign | null;

//     fetchCampaigns: () => Promise<void>;
//     createCampaign: (campaign: Campaign) => Promise<void>;
//     selectCampaign: (campaignId: number) => Promise<void>;
//     fetchCampaign: (campaignId: number) => Promise<void>;
//     updateCampaignName: (id: number, name: string) => Promise<void>;
//     updateCampaignTable: (tableId: number, dailyCountMax: number) => Promise<void>;
//     updateCampaignField: (fieldId: number, changes: Partial<CampaignTableField>) => Promise<void>;
//     // clearCampaign: () => void;
// }

// export const stateColorMap = {
//     "ok": "text-green-600",
//     "loading": "text-gray-600",
//     "error": "text-amber-600"
// }

// export const useCampaign = create<CampaignState>((set, get) => ({
//     campaigns: [],
//     selectedCampaignId: number,

//     status: "ok",
//     action: null,
//     message: null,
//     fetchCampaigns: async () => {
//         set({ action: "fetchCampaigns", status: "loading", message: "Loading campaigns..." });
//         try {
//             let data = await getCampaigns();
//             data = data.map(campaign => {
//                 return {
//                     ...campaign,
//                     tables: get().campaignTables.filter(table => 
//                         table.campaign_id === campaign.id
//                     )
//                 }
//             })
//             set({ campaigns: data, status: "ok", message: "Campaigns loaded successfully" });
//         } catch (error) {
//             set({ status: "error", message: "Failed to load campaigns" });
//         }
//     },
//     createCampaign: async (campaign: Campaign) => {
//         set({ action: "createCampaign", status: "loading", message: "Creating campaign..." });
//         try {
//             await createCampaign(campaign);
//             set({ message: "Campaign created successfully" });
//             await get().fetchCampaigns();
//             get().selectCampaign(campaign.id);
//         } catch (error) {
//             set({ status: "error", message: "Failed to create campaign" });
//         }
//     },
//     selectCampaign: async (campaignId: number) => {
//         try {
//             const campaign = get().campaigns.find(campaign => campaign.id === campaignId);
//             if (campaign?.tables) { // if tables are already loaded, just select the campaign
//                 set({ selectedCampaign: campaign })
//             } else { // if tables are not loaded, load the campaign and tables
//                 set({ action: "selectCampaign", status: "loading", message: "Loading campaign..." });
//                 const data = await getCampaignDetail(campaignId);
//                 set({
//                     campaigns: get().campaigns.map(campaign => campaign.id === campaignId ? data : campaign),
//                     selectedCampaign: data,
//                     status: "ok",
//                     message: "Campaign loaded successfully"
//                 });
//             }
//         } catch (error) {
//             set({ status: "error", message: "Failed to load campaign" });
//         }
//     },
//     fetchCampaign: async (campaignId: number) => {
//         try {
//             set({ action: "fetchCampaign", status: "loading", message: "Loading campaign..." });
//             const data = await getCampaignDetail(campaignId);
//             set({
//                 campaigns: get().campaigns.map(campaign => campaign.id === campaignId ? data : campaign),
//                 selectedCampaign: data,
//                 status: "ok",
//                 message: "Campaign loaded successfully"
//             });
//         } catch (error) {
//             set({ status: "error", message: "Failed to load campaign" });
//         }
//     },

//     updateCampaignName: async (id: number, name: string) => {
//         set({ action: "updateCampaignName", status: "loading", message: "Updating campaign name..." });
//         try {
//             await updateCampaignName(id, name);
//             set((state) => ({
//                 campaign: state.campaign ? { ...state.campaign, name } : null,
//                 status: "ok",
//                 message: "Campaign name updated successfully"
//             }));
//         } catch (error) {
//             set({ status: "error", message: "Failed to update campaign name" });
//         }
//     },

//     updateCampaignTable: async (tableId: number, dailyCountMax: number) => {
//         set({ action: "updateCampaignTable", status: "loading", message: "Updating campaign table..." });
//         try {
//             await updateCampaignTable(tableId, dailyCountMax);
//             set((state) => ({
//                 campaign: state.campaign ? {
//                     ...state.campaign,
//                     tables: state.campaign.tables?.map(table =>
//                         table.id === tableId ? { ...table, daily_count_max: dailyCountMax } : table
//                     )
//                 } : null,
//                 status: "ok",
//                 message: "Campaign table updated successfully"
//             }));
//         } catch (error) {
//             set({ status: "error", message: "Failed to update campaign table" });
//         }
//     },

//     updateCampaignField: async (fieldId: number, changes: Partial<CampaignTableField>) => {
//         set({ action: "updateCampaignField", status: "loading", message: "Updating campaign field..." });
//         try {
//             await updateCampaignField(fieldId, changes);
//             set((state) => ({
//                 campaign: state.campaign ? {
//                     ...state.campaign,
//                     tables: state.campaign.tables?.map(table => ({
//                         ...table,
//                         fields: table.fields?.map(field =>
//                             field.id === fieldId ? { ...field, ...changes } : field
//                         )
//                     }))
//                 } : null,
//                 status: "ok",
//                 message: "Campaign field updated successfully"
//             }));
//         } catch (error) {
//             set({ status: "error", message: "Failed to update campaign field" });
//         }
//     },

//     // clearCampaign: () => set({ campaign: null, status: "ok", action: null, message: null })
// }));
