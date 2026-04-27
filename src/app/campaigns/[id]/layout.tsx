import Header from "@/components/common/CampaignHeader";
import Sidebar from "@/components/common/Sidebar";
import TimeHeadline from "@/components/common/TimeHeadline";
import CampaignStoreProvider from "@/providers/CampaignStoreProvider";
import { getCampaignInfo } from "@/services/campaignService";
import { FetchedCampaign } from "@/types/campaign";
import { notFound } from "next/navigation";

export default async function CampaignLayout({
    params,
    children,
}: Readonly<{
    params: { id: string };
    children: React.ReactNode;
}>) {
    const { id } = await params;
    const campaignId = parseInt(id);

    let campaign: FetchedCampaign | null = null;
    try {
        campaign = await getCampaignInfo(campaignId);
    } catch {
        notFound();
    }

    return (
        <CampaignStoreProvider campaignId={campaignId} campaign={campaign}>
            <div className="w-full h-screen bg-gray-50 flex flex-row">
                <Sidebar />
                <div className="flex flex-col w-full items-stretch grow overflow-auto">
                    <TimeHeadline />
                    <Header />
                    <div className="flex flex-row grow w-full overflow-hidden">
                        <main className="flex flex-col w-full items-stretch gap-4 grow overflow-auto p-4">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </CampaignStoreProvider >

    );
}
