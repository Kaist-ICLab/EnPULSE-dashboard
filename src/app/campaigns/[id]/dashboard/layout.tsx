import SectionStateInitProvider from "@/components/SectionStateInitProvider";

export default function CampaignLayout({
    children,
}: Readonly<{
    params: { id: string };
    children: React.ReactNode;
}>) {
    return (
        <SectionStateInitProvider>
            {children}
        </SectionStateInitProvider>
    );
}
