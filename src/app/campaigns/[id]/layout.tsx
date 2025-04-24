import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";
import { loadCampaignsFromServer } from "@/hooks/loadCampaigns";
import { notFound } from "next/navigation";

export default async function CampaignLayout({
    params,
    children,
}: Readonly<{
    params: { id: string };
    children: React.ReactNode;
}>) {
    const campaigns = await loadCampaignsFromServer();
    const { id } = await params;
    const campaignId = parseInt(id);
    const campaignExists = campaigns.some(campaign => campaign.id === campaignId);

    const currentCampaign = campaigns.find((campaign) => campaign.id === campaignId) || { id: -1, name: "Unknown Campaign" };

    if (!campaignExists) notFound();

    return (
        <div className="w-full h-screen bg-gray-50 flex flex-row ">
            <Sidebar />
            <div className="flex flex-col w-full overflow-hidden">
                <Header
                    campaigns={campaigns}
                    currentCampaign={currentCampaign}
                />
                <main className="flex flex-col w-full items-stretch p-4 gap-4 grow overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
