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
      <div className="flex w-full grow flex-col items-stretch overflow-auto">
        <MainHeader />
        <div className="flex w-full grow flex-row overflow-hidden">
          <div className="flex w-full grow flex-row bg-gray-50">
            <CampaignCreateSidebar />
            <main className="flex w-full grow flex-col items-stretch gap-4 overflow-auto p-4">
              <div className="h-full max-w-3xl">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </CampaignConfigEditStoreProvider>
  );
}
