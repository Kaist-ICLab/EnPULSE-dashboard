"use client";
import { Card } from "flowbite-react";
import Link from "next/link";
import useCampaign from "@/hooks/useCampaign";
import { useEffect } from "react";

// Campaign selection page
const CampaignsPage: React.FC = () => {
    const { campaigns, fetchCampaigns } = useCampaign();
    useEffect(() => {
        fetchCampaigns();
    }, [fetchCampaigns]);

    return (
        <div className="w-full min-h-screen bg-gray-50 flex flex-row ">
            <aside className="min-h-screen w-64 flex flex-col border-r border-gray-200">
                <div className="px-5 h-16 flex items-center text-black text-2xl font-bold">DataSentry</div>
            </aside>
            <div className="flex flex-col w-full p-4">
                <h1>Campaigns</h1>
                <div className="flex flex-col justify-between items-center p-4 gap-8">
                    {Array.from(campaigns.values()).map((campaign) => (
                        <Card key={`campaign-${campaign.id}`} className="w-[50%]">
                            <Link href={`/campaigns/${campaign.id}`} className="flex flex-col items-center">
                                <div>{`campagin-${campaign.id} / ${campaign.name}`}</div>
                            </Link>
                        </Card>
                    ))}
                    <Card className="w-[50%]">
                        <Link href={`/campaigns/create`} className="flex flex-col items-center">
                            <div>+ Create New Campaign</div>
                        </Link>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default CampaignsPage;
