import CampaignConfigEditStoreProvider from "@/providers/CampaignConfigEditStoreProvider";
import { CampaignHeader } from "@/components/common/CampaignHeader";
import { SettingsHeaderMenuItems } from "@/components/common/CampaignHeaderMenuItems";
import { getCampaignInfo } from "@/services/campaignService";

export default async function SettingsLayout({
    params,
    children,
}: Readonly<{
    params: { id: string };
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
            <div className="flex flex-row grow w-full overflow-hidden">
                <main className="flex flex-col w-full items-stretch gap-4 grow overflow-auto p-4">
                    <div className="max-w-3xl">
                        {children}
                    </div>
                </main>
            </div>
        </CampaignConfigEditStoreProvider>
    );
}
