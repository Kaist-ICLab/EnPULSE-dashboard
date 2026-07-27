'use client';

import { useCampaignListStore } from '@/providers/CampaignListStoreProvider';
import { useCampaignStore } from '@/providers/CampaignStoreProvider';
import { Dropdown, DropdownDivider, DropdownHeader, DropdownItem } from 'flowbite-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';

const CampaignDropdown: React.FC = () => {
    const router = useRouter();
    const campaignList = useCampaignListStore((state) => state.campaignList);
    const selectedCampaignId = useCampaignStore((state) => state.selectedCampaignId);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const submenuCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isCreateSubmenuOpen, setIsCreateSubmenuOpen] = useState(false);

    const currentCampaignName = useMemo(() => campaignList.get(selectedCampaignId!)?.name, [campaignList, selectedCampaignId]);

    const openCreateSubmenu = () => {
        if (submenuCloseTimerRef.current) {
            clearTimeout(submenuCloseTimerRef.current);
            submenuCloseTimerRef.current = null;
        }
        setIsCreateSubmenuOpen(true);
    };
    const closeCreateSubmenuWithDelay = () => {
        if (submenuCloseTimerRef.current) clearTimeout(submenuCloseTimerRef.current);
        submenuCloseTimerRef.current = setTimeout(() => {
            setIsCreateSubmenuOpen(false);
            submenuCloseTimerRef.current = null;
        }, 220);
    };

    return (
        <>
            <Dropdown
                dismissOnClick={true}
                color="light"
                placement="bottom-start"
                className="w-50"
                renderTrigger={() => (
                    <button className="bg-transparent hover:bg-transparent focus:ring-0 flex items-center gap-1 font-semibold text-xl ml-2">
                        {currentCampaignName}
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

                <DropdownItem
                    className="relative !px-3 !py-1.5"
                    onMouseEnter={openCreateSubmenu}
                    onMouseLeave={closeCreateSubmenuWithDelay}
                    as="div"
                >
                    <button
                        className="w-full flex items-center justify-between text-sm text-gray-700 hover:bg-gray-100 rounded-lg text-left"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsCreateSubmenuOpen((prev) => !prev);
                        }}
                    >
                        Create a campaign
                        <span className="icon-[material-symbols--chevron-right-rounded] w-5 h-5" />
                    </button>

                    {isCreateSubmenuOpen && (
                        <>
                            <div
                                className="absolute left-full top-0 h-full w-2"
                                onMouseEnter={openCreateSubmenu}
                                onMouseLeave={closeCreateSubmenuWithDelay}
                            />
                            <div
                                className="absolute left-full top-0 ml-1 w-59 rounded-sm border border-gray-200 bg-white shadow-lg z-50 py-1"
                                onMouseEnter={openCreateSubmenu}
                                onMouseLeave={closeCreateSubmenuWithDelay}
                            >
                                <button
                                    className="w-full text-left text-sm text-gray-700 hover:bg-gray-100 px-3 py-1.5 cursor-pointer"
                                    onClick={() => router.push("/create/general")}
                                >
                                    Start with blank config
                                </button>
                                <button
                                    className="w-full text-left text-sm text-gray-700 hover:bg-gray-100 px-3 py-1.5 cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Start from imported config
                                </button>
                            </div>
                        </>
                    )}
                </DropdownItem>
                <DropdownDivider />
                <DropdownHeader className="!px-3 !py-1.5 text-sm text-gray-500 text-left">
                    Your campaigns
                </DropdownHeader>
                {Array.from(campaignList.entries()).map(([id, { name }]) => (
                    <DropdownItem key={id} className={`!px-3 !py-1.5 ${id === selectedCampaignId ? 'text-blue-600' : 'text-gray-700'}`}>
                        <Link href={`/campaigns/${id}/`} className={`w-full h-full block rounded-lg text-left `}>
                            {name}
                        </Link>
                    </DropdownItem>
                ))}
            </Dropdown>
            {/* Sneaky sneaky input */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                        const raw = await file.text();
                        sessionStorage.setItem(process.env.NEXT_PUBLIC_PENDING_IMPORTED_CONFIG_KEY ?? "", raw);
                        router.push("/create/general");
                    } catch {
                        window.alert("Failed to read configuration file.");
                    }
                    e.target.value = "";
                }}
            />
        </>

    );
};

export default CampaignDropdown; 