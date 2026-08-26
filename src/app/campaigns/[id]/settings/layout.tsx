import CampaignConfigEditStoreProvider from "@/providers/CampaignConfigEditStoreProvider";
import { CampaignHeader } from "@/components/common/CampaignHeader";
import { SettingsHeaderMenuItems } from "@/components/common/CampaignHeaderMenuItems";
import { getCampaignInfo } from "@/services/campaignService";

import { ValidationBanner } from "@/components/configuration/ValidationBanner";

export default async function SettingsLayout({
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
    <CampaignConfigEditStoreProvider campaign={campaign}>
      <CampaignHeader>
        <SettingsHeaderMenuItems />
      </CampaignHeader>
      <ValidationBanner />
      <div className="flex w-full grow flex-row overflow-hidden">
        <main className="flex w-full grow flex-col items-stretch gap-4 overflow-auto p-4">
          <div className="max-w-3xl">{children}</div>
        </main>
      </div>
    </CampaignConfigEditStoreProvider>
  );
}
