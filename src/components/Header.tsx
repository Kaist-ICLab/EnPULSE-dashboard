"use client";
import useCampaigns from "@/hooks/useCampaigns";
import { Icon } from "@iconify/react";
import React, { useState, useRef, useEffect } from "react";


const Header: React.FC = () => {
    const { campaigns, currentCampaign } = useCampaigns();
    const [isDropdownOpen, setDropdownOpenStatus] = useState<Boolean>(false);

    return (
        <div className="w-full h-16 flex justify-between items-center border-b border-gray-200 px-4">
            <div className="flex justify-start items-center gap-2" onClick={() => setDropdownOpenStatus(!isDropdownOpen)}>
                <div className="py-2 rounded-xl flex justify-center items-center gap-2 text-gray-700 hover:text-gray-500">
                    <div>{currentCampaign.name}</div>
                    <Icon className="w-9 h-9" icon="material-symbols-light:arrow-drop-down" />
                </div>
                {isDropdownOpen && (
                    <Dropdown
                        campaigns={campaigns}
                        currentCampaign={currentCampaign}
                        setDropdownOpenStatus={setDropdownOpenStatus}
                    />
                )}
            </div>
            <div className="w-14 flex justify-start items-center gap-4">
                <div className="p-4 rounded-2xl flex justify-center items-center gap-2">
                    <Icon className="w-6 h-6 text-gray-700" icon="mingcute:notification-line" />
                </div>
            </div>
        </div>
    );
}


const Dropdown: React.FC<{
    campaigns: { id: number; name: string }[];
    currentCampaign: { id: number; name: string };
    setDropdownOpenStatus: (status: boolean) => void;
}> = ({
    campaigns,
    currentCampaign,
    setDropdownOpenStatus
}) => {
    const ref = useRef<HTMLInputElement>(null);
    const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            setDropdownOpenStatus(false);
        }
    };
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (<div ref={ref} className="absolute z-10 mt-2 py-2 w-75 origin-top-right divide-y divide-gray-200 rounded-lg bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden top-4">
        <div className="pb-1">
            <a href={`/campaigns/${currentCampaign.id}`} className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">{currentCampaign.name}</a>
            <a href="/campaigns" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">See all campaigns</a>
            <a href="/campaigns/create" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">Create a campaign</a>
        </div>
        <div>
            <div className="block mt-1 px-4 py-2 text-sm text-gray-500">Your campaigns</div>
            {campaigns.map((campaign) => (
                <a key={campaign.id} href={`/campaigns/${campaign.id}/`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">{campaign.name}</a>
            ))}
        </div>
    </div>)
}


export default Header;