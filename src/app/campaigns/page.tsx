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
        <div className="p-8 w-full max-w-7xl mx-auto flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Campaigns Dashboard</h1>
                <p className="text-gray-500 mt-2">Manage and monitor all your ongoing and past campaigns in one place.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {Array.from(campaignList.entries()).map(([id, { name, description, start_time, end_time }]) => {
                    const progress = calculateProgress(start_time, end_time);
                    const isCompleted = progress >= 100;
                    const isUpcoming = progress === 0;
                    const isActive = progress > 0 && progress < 100;
                    
                    return (
                        <Card key={`campaign-${id}`} className="w-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-none shadow-md overflow-hidden group rounded-xl">
                            <Link href={`/campaigns/${id}`} className="block h-full">
                                <div className="flex flex-col h-full gap-5 p-2">
                                    <div className="flex justify-between items-start gap-4">
                                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">{name}</h3>
                                        {isUpcoming && (
                                            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 whitespace-nowrap">Upcoming</span>
                                        )}
                                        {isActive && (
                                            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 whitespace-nowrap">Active</span>
                                        )}
                                        {isCompleted && (
                                            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 whitespace-nowrap">Completed</span>
                                        )}
                                    </div>
                                    
                                    <p className="text-sm text-gray-500 line-clamp-2 flex-grow">
                                        {description ? description : "No description provided"}
                                    </p>
                                    
                                    <div className="flex flex-col gap-3 mt-2">
                                        <div className="flex justify-between items-center text-xs font-medium text-gray-600">
                                            <span>Progress</span>
                                            <span>{Math.max(0, Math.min(100, progress))}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ease-out ${isCompleted ? 'bg-blue-500' : 'bg-gradient-to-r from-blue-500 to-indigo-600'}`}
                                                style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
                                            <span>Start: {dayjs(start_time).format("MMM D, YYYY")}</span>
                                            <span>End: {dayjs(end_time).format("MMM D, YYYY")}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </Card>
                    );
                })}
                
                {campaignList.size === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed border-gray-300 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No campaigns found</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new campaign.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
    );
}

export default CampaignsPage;
