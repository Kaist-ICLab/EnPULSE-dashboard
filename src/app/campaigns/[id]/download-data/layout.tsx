"use client";
import DownloadStoreProvider from "@/providers/DownloadStoreProvider";
import { CampaignHeader } from "@/components/common/CampaignHeader";

export default function DownloadDataLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <DownloadStoreProvider>
            <CampaignHeader />
            <div className="flex flex-row grow w-full overflow-hidden">
                <main className="flex flex-col w-full items-stretch gap-4 grow overflow-auto p-4">
                    {children}
                </main>
            </div>
        </DownloadStoreProvider>
    );
}