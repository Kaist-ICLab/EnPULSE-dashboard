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
      <div className="flex w-full grow flex-row overflow-hidden">
        <main className="flex w-full grow flex-col items-stretch gap-4 overflow-auto p-4">{children}</main>
      </div>
    </DownloadStoreProvider>
  );
}
