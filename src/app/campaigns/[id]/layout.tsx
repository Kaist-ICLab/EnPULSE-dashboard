import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";
import { notFound } from "next/navigation";
import { getCampaigns } from "@/services/campaignService";
import CampaignInitProvider from "@/components/CampaignInitProvider";

export default async function CampaignLayout({
    params,
    children,
}: Readonly<{
    params: { id: string };
    children: React.ReactNode;
}>) {
    const { id } = await params;
    const campaigns = await getCampaigns();
    const campaignId = parseInt(id);
    const currentCampaign = campaigns.find((campaign) => campaign.id === campaignId);
    if (!currentCampaign) {
        notFound();
    }

    return (
        <div className="w-full h-screen bg-gray-50 flex flex-row ">
            <Sidebar />
            <CampaignInitProvider
                campaignId={campaignId}
                campaigns={campaigns}
            >
                <div className="flex flex-col w-full overflow-hidden">
                    <Header />
                    <main className="flex flex-col flex-1 w-full items-stretch gap-4 grow overflow-auto">
                        {children}
                    </main>
                </div>
            </CampaignInitProvider>
        </div>
    );
}
