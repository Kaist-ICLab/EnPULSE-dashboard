import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";
import { loadCampaignsFromServer } from "@/hooks/loadCampaigns";

export default async function CampaignLayout({
    params,
    children,
}: Readonly<{
    params: { id: number };
    children: React.ReactNode;
}>) {
    const campaigns = await loadCampaignsFromServer();
    const { id } = await params;
    const currentCampaign = campaigns.find((campaign) => campaign.id == id) || { id: -1, name: "Unknown Campaign" };

    return (
        <div className="w-full min-h-screen bg-gray-50 flex flex-row ">
            <Sidebar />
            <div className="flex flex-col w-full overflow-hidden">
                <Header
                    campaigns={campaigns}
                    currentCampaign={currentCampaign}
                />
                <main className="flex flex-col w-full items-stretch p-4 gap-4 grow">
                    {children}
                </main>
            </div>
        </div>
    );
}
