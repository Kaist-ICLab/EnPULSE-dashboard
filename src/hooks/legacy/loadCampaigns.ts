import { Campaign } from "./useCampaigns";

export const loadCampaignsFromServer = async () => {
    return [
        { id: 0, name: "Campaign A" },
        { id: 1, name: "Campaign B" },
        { id: 2, name: "Campaign C" },
    ] as Campaign[];
}