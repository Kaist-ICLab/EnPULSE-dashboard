'use client';

import useCampaign from '@/hooks/useCampaign';
import { Dropdown, DropdownDivider, DropdownHeader, DropdownItem } from 'flowbite-react';
import Link from 'next/link';

const CampaignDropdown: React.FC = () => {
    const { campaigns, selectedCampaignId } = useCampaign();
    const currentCampaign = campaigns.get(selectedCampaignId!);
    if (!currentCampaign) {
        return null;
    }
    return (
        <Dropdown
            dismissOnClick={true}
            color="light"
            size="md"
            placement="bottom-start"
            className="w-50"
            renderTrigger={() => (
                <button className="bg-transparent hover:bg-transparent focus:ring-0 flex items-center gap-1 font-semibold text-md ml-2">
                    {currentCampaign.name}
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            )}
        >
            <DropdownItem className="!px-3 !py-1.5">
                <Link href="/campaigns" className="w-full h-full block text-sm text-gray-700 hover:bg-gray-100 rounded-lg text-left">
                    See all campaigns
                </Link>
            </DropdownItem>

            <DropdownItem className="!px-3 !py-1.5">
                <Link href="/campaigns/create" className="w-full h-full block text-sm text-gray-700 hover:bg-gray-100 rounded-lg text-left">
                    Create a campaign
                </Link>
            </DropdownItem>
            <DropdownDivider />
            <DropdownHeader className="!px-3 !py-1.5 text-sm text-gray-500 text-left">
                Your campaigns
            </DropdownHeader>
            {Array.from(campaigns.values()).map((campaign) => (
                <DropdownItem key={campaign.id} className={`!px-3 !py-1.5 ${campaign.id === currentCampaign.id ? 'text-blue-600' : 'text-gray-700'}`}>
                    <Link href={`/campaigns/${campaign.id}/`} className={`w-full h-full block rounded-lg text-left `}>
                        {campaign.name}
                    </Link>
                </DropdownItem>
            ))}
        </Dropdown>
    );
};

export default CampaignDropdown; 