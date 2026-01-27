import NewCampaignTablesInitProvider from "@/components/NewCampaignInitProvider";

export default async function SettingsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <NewCampaignTablesInitProvider isNewCampaign={false}>
            {children}
        </NewCampaignTablesInitProvider>
    );
}
