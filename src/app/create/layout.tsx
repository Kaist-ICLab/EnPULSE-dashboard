import MainHeader from "@/components/common/MainHeader";
import CampaignCreateSidebar from "@/components/configuration/CampaignCreateSidebar";
import CampaignConfigEditStoreProvider from "@/providers/CampaignConfigEditStoreProvider";

export default async function CampaignLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <CampaignConfigEditStoreProvider isNewCampaign={true}>
            <div className="flex flex-col w-full items-stretch grow overflow-auto">
                <MainHeader />
                <div className="flex flex-row grow w-full overflow-hidden">
                    <div className="w-full grow bg-gray-50 flex flex-row">
                        <CampaignCreateSidebar />
                        <main className="flex flex-col w-full items-stretch gap-4 grow p-4 overflow-auto">
                            <div className="h-full max-w-3xl">
                                {children}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </CampaignConfigEditStoreProvider>
    );
}
