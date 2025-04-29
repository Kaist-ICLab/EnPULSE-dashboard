
import RenameCampaign from "@/components/settings/RenameCampaign";
import { loadCampaignsFromServer } from "@/hooks/loadCampaigns";

export default async function Page({
    params,
}: Readonly<{
    params: { id: string };
}>) {
    const campaigns = await loadCampaignsFromServer();
    const { id } = await params;
    const campaignId = parseInt(id);
    const currentCampaign = campaigns.find((campaign) => campaign.id === campaignId) || { id: -1, name: "Unknown Campaign" };

    return <RenameCampaign currentCampaign={currentCampaign} />
}