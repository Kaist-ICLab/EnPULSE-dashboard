"use client";
import { Card } from "flowbite-react";
import useCampaigns from "@/hooks/useCampaigns";
import Link from "next/link";

// Campaign selection page
const CampaignsPage: React.FC = () => {
    const { campaigns } = useCampaigns();
    return (
        <div className="w-full min-h-screen bg-gray-50 flex flex-row ">
            <aside className="min-h-screen w-64 flex flex-col border-r border-gray-200">
                <div className="px-6 h-16 flex items-center text-black text-2xl font-bold">DataSentry</div>
            </aside>
            <div className="flex flex-col w-full p-4">
                <h1>Campaigns</h1>
                <div className="flex flex-row justify-between items-center p-4 gap-8">
                    {campaigns.map((campaign) => (
                        <Card key={`campaign-${campaign.id}`} >
                            <Link href={`/campaigns/${campaign.id}`} className="flex flex-col items-center">
                                <div>{`campagin-${campaign.id} / ${campaign.name}`}</div>
                            </Link>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CampaignsPage;
