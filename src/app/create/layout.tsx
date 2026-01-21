import CampaignCreateHeader from "@/components/create/CampaignCreateHeader";
import CampaignCreateSidebar from "@/components/create/CampaignCreateSidebar";

export default async function CampaignLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="w-full h-screen bg-gray-50 flex flex-row">
            <CampaignCreateSidebar />
            <div className="flex flex-col w-full items-stretch grow overflow-auto">
                <CampaignCreateHeader />
                <div className="flex flex-row grow w-full overflow-hidden">
                    <main className="flex flex-col w-full items-stretch gap-4 grow overflow-auto p-4 max-w-3xl">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
