import SectionParamStoreProvider from "@/providers/SectionParamStoreProvider";
import { CampaignHeader } from "@/components/common/CampaignHeader";
import { DashboardHeaderMenuItems } from "@/components/common/CampaignHeaderMenuItems";
import { getCampaignInfo } from "@/services/campaignService";

export default async function DashboardLayout({
    params,
    children,
}: Readonly<{
    params: { id: string };
    children: React.ReactNode;
}>) {

    const { id } = await params;
    const campaignId = parseInt(id);
    const campaign = await getCampaignInfo(campaignId);

    return <SectionParamStoreProvider campaign={campaign}>
        <CampaignHeader>
            <DashboardHeaderMenuItems />
        </CampaignHeader>
        <div className="flex flex-row grow w-full overflow-hidden">
            <main className="flex flex-col w-full items-stretch gap-4 grow overflow-auto p-4">
                {children}
            </main>
        </div>
    </SectionParamStoreProvider>;
}