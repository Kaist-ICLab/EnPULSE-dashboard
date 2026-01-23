"use client";
import { Card } from "flowbite-react";
import Link from "next/link";
import useCampaign from "@/hooks/useCampaign";
import { useEffect } from "react";

// Campaign selection page
const CampaignsPage: React.FC = () => {
    const { campaignList, fetchCampaigns } = useCampaign();
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
                <div className="flex flex-col justify-between items-center p-4 gap-6">
                    {Array.from(campaignList.entries()).map(([id, name]) => (
                        <Card key={`campaign-${id}`} className="w-[50%]">
                            <Link href={`/campaigns/${id}`} className="flex flex-col items-center">
                                <div>{`campagin-${id} / ${name}`}</div>
                            </Link>
                        </Card>
                    ))}
                    <Card className="w-[50%]">
                        <Link href={`/create`} className="flex flex-col items-center">
                            <div className="flex items-center">
                                <span className="icon-[tabler--plus] mr-2" />Create New Campaign
                            </div>
                        </Link>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default CampaignsPage;
