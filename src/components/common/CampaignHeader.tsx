"use client";
import CampaignDropdown from "@/components/common/CampaignDropdown";
import React from "react";

export const CampaignHeader: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    return (
        <div className="w-full min-h-16 flex justify-between items-center border-b border-gray-200 px-4">
            <div className="flex justify-start items-center gap-2">
                <div className="py-2 rounded-xl flex justify-center items-center gap-2 text-gray-700 hover:text-gray-500">
                    <CampaignDropdown />
                </div>
            </div>
            {children}
        </div>
    );
}