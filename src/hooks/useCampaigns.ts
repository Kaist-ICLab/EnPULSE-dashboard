import { create } from "zustand";
import { useEffect, useMemo } from "react";
import { useParams, useRouter, usePathname } from 'next/navigation';

export type Campaign = {
    id: number;
    name: string;
};

type CampaignState = {
    campaigns: Campaign[];
    campaignId: number;
    selectCampaign: (id: number) => void;
    renameCampaign: (id: number, newName: string) => void;
};

// Load campaigns from localStorage or use default if not available
const loadCampaigns = (): Campaign[] => {
    // Prevent errors in the server
    if (typeof window === 'undefined') return [
        { id: 0, name: "Campaign A" },
        { id: 1, name: "Campaign B" },
        { id: 2, name: "Campaign C" },
    ];
    
    const savedCampaigns = localStorage.getItem('campaigns');
    return savedCampaigns ? JSON.parse(savedCampaigns) : [
        { id: 0, name: "Campaign A" },
        { id: 1, name: "Campaign B" },
        { id: 2, name: "Campaign C" },
    ];
};

// Load campaignId from localStorage or use default
const loadCampaignId = (): number => {
    if (typeof window === 'undefined') return 0;
    
    const savedCampaignId = localStorage.getItem('campaignId');
    return savedCampaignId ? parseInt(savedCampaignId, 10) : 0;
};

const useCampaignStore = create<CampaignState>((set) => ({
    campaigns: loadCampaigns(),
    campaignId: loadCampaignId(),
    selectCampaign: (id: number) => {
        set({ campaignId: id });
        if (typeof window !== 'undefined') {
          localStorage.setItem('campaignId', id.toString());
        }
    },
    renameCampaign: (id: number, newName: string) => {
        set((state) => {
          const newState = {
            campaigns: state.campaigns.map((campaign) => 
                campaign.id === id ? { ...campaign, name: newName } : campaign
            )
          };
          
          // Save to localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('campaigns', JSON.stringify(newState.campaigns));
          }
          
          return newState;
        });
    },
}));


export const useCampaigns = () => {
    const params = useParams();
    // const router = useRouter();

    const campaigns = useCampaignStore((s) => s.campaigns);
    const campaignId = useCampaignStore((s) => s.campaignId);
    const setCampaignId = useCampaignStore((s) => s.selectCampaign);
    const changeCampaignName = useCampaignStore((s) => s.renameCampaign);

    const currentCampaign = useMemo(() => {
        return campaigns.find((c) => c.id === campaignId) || { id: -1, name: "Unknown Campaign" };
      }, [campaigns, campaignId]);

    // ✅ 1. URL → state
    useEffect(() => {
        const idFromUrl = parseInt(params.id as string, 10);
        // console.log(`URL ID: ${idFromUrl}`);
        if (!isNaN(idFromUrl)) {
            // console.log("Setting campaignId from URL");
            setCampaignId(idFromUrl);
        }
    }, [params.id]);


    // ✅ State Change
    const selectCampaign = (id: number) => {
        setCampaignId(id);
    };

    // Rename campaign with validation
    const renameCampaign = (id: number, newName: string): boolean => {
        // Validate the new name
        if (!newName || newName.trim() === '') {
            return false; // Empty name is not valid
        }

        // Find the campaign
        const campaign = campaigns.find(c => c.id === id);
        if (!campaign) {
            return false; // Campaign not found
        }

        // Check if the name is actually changing
        if (campaign.name === newName) {
            return false; // No change needed
        }

        // If all validations pass, rename the campaign
        changeCampaignName(id, newName);
        return true;
    };

    return {
        campaigns,
        campaignId,
        currentCampaign,
        selectCampaign,
        renameCampaign,
    };
};
export default useCampaigns;