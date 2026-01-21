"use client";
import React from "react";
import { usePathname } from "next/navigation";

const CampaignCreateHeader: React.FC = () => {
    const pathname = usePathname();

    const getPageTitle = () => {
        if (pathname.includes('/name')) return "Campaign Information";
        if (pathname.includes('/active-sensing')) return "Configure Active Sensing";
        if (pathname.includes('/passive-sensing')) return "Configure Passive Sensing";
        return "Create Campaign";
    };

    return (
        <div className="w-full min-h-16 flex items-center border-b border-gray-200 px-6">
            <h2 className="text-2xl font-bold text-gray-900 grow">{getPageTitle()}</h2>
        </div>
    );
}

export default CampaignCreateHeader;