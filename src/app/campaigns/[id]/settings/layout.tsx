import ConfigEditInitProvider from "@/components/ConfigEditInitProvider";

export default async function SettingsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ConfigEditInitProvider isNewCampaign={false}>
            <div className="max-w-3xl">
                {children}
            </div>
        </ConfigEditInitProvider>
    );
}
