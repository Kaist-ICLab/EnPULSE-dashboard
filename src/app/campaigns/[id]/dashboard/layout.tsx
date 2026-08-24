import SectionParamStoreProvider from "@/providers/SectionParamStoreProvider";
import { CampaignHeader } from "@/components/common/CampaignHeader";
import { DashboardHeaderMenuItems } from "@/components/common/CampaignHeaderMenuItems";
import { getCampaignInfo } from "@/services/campaignService";

export default async function DashboardLayout({
  params,
  children,
}: Readonly<{
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}>) {
  const { id } = await params;
  const campaignId = parseInt(id);
  const campaign = await getCampaignInfo(campaignId);

  return (
    <SectionParamStoreProvider campaign={campaign}>
      <CampaignHeader>
        <DashboardHeaderMenuItems />
      </CampaignHeader>
      <div className="flex w-full grow flex-row overflow-hidden">
        <main className="flex w-full grow flex-col items-stretch gap-4 overflow-auto p-4">{children}</main>
      </div>
    </SectionParamStoreProvider>
  );
}
