"use client";
import useCampaigns, { Campaign } from "@/hooks/useCampaigns";
import React, { useEffect } from "react";
import CampaignDropdown from "../dashboard/CampaignDropdown";


const Header: React.FC<{ campaigns: Campaign[], currentCampaign: Campaign }> = ({ campaigns, currentCampaign }) => {
    console.log(currentCampaign.id)
    const { setCampaignValues } = useCampaigns();
    useEffect(() => {
        setCampaignValues(currentCampaign.id, campaigns);
    }, [currentCampaign, campaigns, setCampaignValues]);

    return (
        <div className="w-full h-16 flex justify-between items-center border-b border-gray-200 px-4">
            <div className="flex justify-start items-center gap-2">
                <div className="py-2 rounded-xl flex justify-center items-center gap-2 text-gray-700 hover:text-gray-500">
                    <CampaignDropdown
                        campaigns={campaigns}
                        currentCampaign={currentCampaign}
                    />
                </div>
            </div>
            <div className="w-14 flex justify-start items-center gap-4">
                <div className="p-4 rounded-2xl flex justify-center items-center gap-2">
                    <span className="w-6 h-6 icon-[mingcute--notification-line] text-gray-700" />
                </div>
            </div>
        </div>
    );
}

export default Header;