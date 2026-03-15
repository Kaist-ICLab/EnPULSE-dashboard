"use client";
import DownloadInitProvider from "@/components/DownloadInitProvider";

export default function DownloadDataLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <DownloadInitProvider>
            {children}
        </DownloadInitProvider>
    );
}