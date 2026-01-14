"use client";
import CampaignDropdown from "@/components/common/CampaignDropdown";
import React from "react";
import { Button } from "flowbite-react";


const Header: React.FC = () => {
    return (
        <div className="w-full min-h-12 flex justify-between items-center border-b border-gray-200 px-4">
            <div className="flex justify-start items-center gap-2">
                <div className="py-2 rounded-xl flex justify-center items-center gap-2 text-gray-700 hover:text-gray-500">
                    <CampaignDropdown />
                </div>
            </div>
            <input
                type="date"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2 py-1 ml-auto mr-auto"
            />
            <Button
                size="xs"
            >
                <span className="icon-[eva--sync-fill] w-4 h-4 mr-2"></span> Sync now
            </Button>
        </div>
    );
}

export default Header;