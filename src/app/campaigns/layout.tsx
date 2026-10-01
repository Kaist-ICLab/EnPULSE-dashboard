import CampaignListStoreProvider from "@/providers/CampaignListStoreProvider";
import { getCampaignList } from "@/services/campaignService";

// Fetch the list on every request. Otherwise Next prerenders it at build time, so the
// build needs a live database and campaigns added outside the dashboard (seed script,
// Supabase Studio) stay hidden until a rebuild.
export const dynamic = "force-dynamic";

export default async function CampaignLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const campaignList = await getCampaignList();

  return <CampaignListStoreProvider campaignList={campaignList}>{children}</CampaignListStoreProvider>;
}
