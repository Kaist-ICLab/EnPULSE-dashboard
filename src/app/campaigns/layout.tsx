import CampaignListStoreProvider from "@/providers/CampaignListStoreProvider";
import { getCampaignList } from "@/services/campaignService";

export default async function CampaignLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const campaignList = await getCampaignList();

  return <CampaignListStoreProvider campaignList={campaignList}>{children}</CampaignListStoreProvider>;
}
