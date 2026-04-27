"use client";
import DownloadStoreProvider from "@/providers/DownloadStoreProvider";

export default function DownloadDataLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <DownloadStoreProvider>
            {children}
        </DownloadStoreProvider>
    );
}