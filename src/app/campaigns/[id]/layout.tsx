import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function CampaignLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-row ">
      <Sidebar />
      <div className="flex flex-col w-full overflow-hidden">
        <Header />
        <main className="flex flex-col w-full items-stretch p-4 grow">
          {children}
        </main>
      </div>
    </div>
  );
}
