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
  params: Promise<{ id: string }>;
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
      <div className="flex h-screen w-full flex-row bg-gray-50">
        <Sidebar />
        <div className="flex w-full grow flex-col items-stretch overflow-auto">
          <TimeHeadline />
          {children}
        </div>
      </div>
    </CampaignStoreProvider>
  );
}
