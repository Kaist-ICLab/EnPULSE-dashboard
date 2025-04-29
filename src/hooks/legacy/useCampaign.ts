"use client";
import { create } from "zustand";
import { useCallback, useEffect, useMemo } from "react";
import { Campaign, CampaignTable, CampaignTableField } from "@/types/campaign";

let data: Campaign[] = [
    {
        id: 1,
        name: "Campaign 1",
        db_type: "URL",
        created_at: new Date()
    },
    {
        id: 2,
        name: "Campaign 2",
        db_type: "FILE",
        created_at: new Date()
    },
];

const useCampaign =  create<{
    campaigns: Campaign[];
    fetchCampaigns: () => Promise<void>;
    loading: boolean;
    error: Error | null;
    selectedCampaignId: number | null;
    selectCampaignId: (id: number) => void;
    // renameCampaign: (newName: string) => boolean;
    // selectedCampaignId: number;
    // selectCampaignId: (id: number) => void;
}>((set, get) => ({
    campaigns: [],
    fetchCampaigns: async () => {
        // TODO - Campaign이 아예 없는 경우?
        if (get().campaigns.length > 0) return;
        set({ loading: true });
        try {
            setTimeout(() => {
                set({ campaigns: data });
            }, 150);
            // const response = await fetch('/api/campaigns');
            // const data = await response.json();
            // set({ campaigns: data });
        } catch (error) {
            set({ error: error as Error });
        } finally {
            set({ loading: false });
        }
    },
    loading: false,
    error: null,
    selectedCampaignId: null,
    selectCampaignId: (id: number) => {
        set({ selectedCampaignId: id });
    }    
    // selectCampaignId: (id: number) => {
    //     set({ selectedCampaignId: id });
    //     if (typeof window !== 'undefined') {
    //         localStorage.setItem('campaignId', id.toString());
    //     }
    // },
    // renameCampaign: (newName: string) => {
    //     set((state) => {
    //         const newState = {
    //             campaigns: state.campaigns.map((campaign) => 
    //                 campaign.id === state.selectedCampaignId ? { ...campaign, name: newName } : campaign
    //             )
    //         };
    //     })
    // }
}));

export default useCampaign;
//     campaigns: [],
//     selectedCampaignId: 0,
//     selectCampaignId: (id: number) => {
//         set({ campaignId: id });
//         if (typeof window !== 'undefined') {
//           localStorage.setItem('campaignId', id.toString());
//         }
//     },
//     renameCampaign: (id: number, newName: string) => {
//         set((state) => {
//           const newState = {
//             campaigns: state.campaigns.map((campaign) => 
//                 campaign.id === id ? { ...campaign, name: newName } : campaign
//             )
//           };
          
//           // Save to localStorage
//           if (typeof window !== 'undefined') {
//             localStorage.setItem('campaigns', JSON.stringify(newState.campaigns));
//           }
          
//           return newState;
//         });
//     },
//     selectCampaigns: (campaigns: Campaign[]) => {
//         set({ campaigns: campaigns });
//     },
// }));

// export const useCampaigns = () => {
//     const campaigns = useCampaignStore((s) => s.campaigns);
//     const campaignId = useCampaignStore((s) => s.campaignId);
//     const setCampaignId = useCampaignStore((s) => s.selectCampaignId);
//     const setCampaigns = useCampaignStore((s) => s.selectCampaigns);

//     const currentCampaign = useMemo(() => {
//         return campaigns.find((c) => c.id === campaignId) || { id: -1, name: "Unknown Campaign" };
//     }, [campaigns, campaignId]);

//     const setCampaignValues = useCallback((campaignId: number, campaigns: Campaign[]) => {
//         setCampaigns(campaigns);
//         setCampaignId(campaignId);
//     }, [setCampaignId, setCampaigns]);


//     // ✅ 1. URL → state
//     useEffect(() => {
//         loadCampaignsFromServer().then(v => {
//             setCampaignValues(v.some(c => c.id == campaignId) ? campaignId : v[0].id, v);
//         });
//     }, [setCampaignValues, campaignId]);


//     // ✅ State Change
//     const selectCampaign = (id: number) => {
//         setCampaignId(id);
//     };

//     const renameCampaign = (id: number, newName: string) => {
//         return false;
//         // set((state) => {
//         //     const newState = {
//         //         campaigns: state.campaigns.map((campaign) => 
//         //             campaign.id === id ? { ...campaign, name: newName } : campaign
//         //         )
//         //     }
//         // }
//     }


//     return {
//         campaigns,
//         campaignId,
//         currentCampaign,
//         selectCampaign,
//         setCampaignValues,
//         renameCampaign,
//     };
// };
// export default useCampaigns;