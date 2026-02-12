import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/CampaignHeader";
import { notFound } from "next/navigation";
import { getCampaignList } from "@/services/campaignService";
import CampaignInitProvider from "@/components/CampaignInitProvider";

export default async function CampaignLayout({
    params,
    children,
}: Readonly<{
    params: { id: string };
    children: React.ReactNode;
}>) {
    const { id } = await params;
    const campaigns = await getCampaignList();
    const campaignId = parseInt(id);
    const currentCampaign = campaigns.find((campaign) => campaign.id === campaignId);
    if (currentCampaign === undefined) {
        notFound();
    }

    return (
        <CampaignInitProvider
            campaignId={campaignId}
            campaigns={campaigns}
        >
            <div className="w-full h-screen bg-gray-50 flex flex-row">
                <Sidebar />
                <div className="flex flex-col w-full items-stretch grow overflow-auto">
                    <Header />
                    <div className="flex flex-row grow w-full overflow-hidden">
                        <main className="flex flex-col w-full items-stretch gap-4 grow overflow-auto p-4">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </CampaignInitProvider >

    );
}
