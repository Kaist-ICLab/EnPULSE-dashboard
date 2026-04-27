"use client";
import MainHeader from "@/components/common/MainHeader";
import { useCampaignListStore } from "@/providers/CampaignListStoreProvider";
import dayjs from "dayjs";
import { Card } from "flowbite-react";
import Link from "next/link";

// Campaign selection page
const CampaignsPage: React.FC = () => {
    const campaignList = useCampaignListStore((state) => state.campaignList);

    const calculateProgress = (startTime: string, endTime: string): number => {
        const now = dayjs();
        const start = dayjs(startTime);
        const end = dayjs(endTime);

        if (now.isBefore(start)) {
            return 0;
        }
        if (now.isAfter(end)) {
            return 100;
        }

        const totalDuration = end.diff(start);
        const elapsed = now.diff(start);
        return parseFloat(((elapsed / totalDuration) * 100).toFixed(2));
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 flex flex-col">
            <MainHeader />
            <div className="flex flex-col items-center p-6 gap-6 max-w-4xl w-full mx-auto">
                {Array.from(campaignList.entries()).map(([id, { name, description, start_time, end_time }]) => {
                    const progress = calculateProgress(start_time, end_time);
                    return (
                        <Card key={`campaign-${id}`} className="w-full hover:shadow-lg transition-shadow duration-200">
                            <Link href={`/campaigns/${id}`} className="block">
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
                                        <p className="text-sm text-gray-400 line-clamp-2">
                                            {description ? description : "No description provided"}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center text-xs text-gray-500">
                                            <span>{Math.max(0, Math.min(100, progress))}% Complete</span>
                                            <span className="text-gray-400">
                                                {dayjs(start_time).format("MMM D, YYYY")} - {dayjs(end_time).format("MMM D, YYYY")}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                                style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}

export default CampaignsPage;
