"use client";
import React from "react";
import { usePathname } from "next/navigation";
import AddSensorButtons from "./AddSensorButtons";

const CampaignCreateHeader: React.FC = () => {
    const pathname = usePathname();

    const getPageTitle = () => {
        if (pathname.includes('/name')) return "Campaign Information";
        if (pathname.includes('/active-sensing')) return "Active Sensing";
        if (pathname.includes('/passive-sensing')) return "Passive Sensing";
        return "Create Campaign";
    };

    const isActiveSensingPage = pathname.includes('/active-sensing');

    return (
        <div className="w-full min-h-16 flex items-center border-b border-gray-200 px-6 relative">
            <h2 className="text-2xl font-bold text-gray-900 grow">Configure {getPageTitle()}</h2>
            {isActiveSensingPage && <AddSensorButtons />}
        </div>
    );
}

export default CampaignCreateHeader;