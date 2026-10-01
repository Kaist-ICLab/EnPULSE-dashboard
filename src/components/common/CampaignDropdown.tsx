"use client";

import { useCampaignListStore } from "@/providers/CampaignListStoreProvider";
import { useCampaignStore } from "@/providers/CampaignStoreProvider";
import { Dropdown, DropdownDivider, DropdownHeader, DropdownItem } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { parseExportedCampaignConfig } from "@/utils/importedConfig";
import { notify } from "@/utils/notify";

const CampaignDropdown: React.FC = () => {
  const router = useRouter();
  const campaignList = useCampaignListStore((state) => state.campaignList);
  const selectedCampaignId = useCampaignStore((state) => state.selectedCampaignId);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const submenuCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isCreateSubmenuOpen, setIsCreateSubmenuOpen] = useState(false);

  const currentCampaignName = useMemo(
    () => campaignList.get(selectedCampaignId!)?.name,
    [campaignList, selectedCampaignId],
  );

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
          <button className="ml-2 flex items-center gap-1 bg-transparent text-xl font-semibold hover:bg-transparent focus:ring-0">
            {currentCampaignName}
            <svg
              className="h-4 w-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      >
        <DropdownItem className="!px-3 !py-1.5">
          <Link
            href="/campaigns"
            className="block h-full w-full rounded-lg text-left text-sm text-gray-700 hover:bg-gray-100"
          >
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
            className="flex w-full items-center justify-between rounded-lg text-left text-sm text-gray-700 hover:bg-gray-100"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsCreateSubmenuOpen((prev) => !prev);
            }}
          >
            Create a campaign
            <span className="icon-[material-symbols--chevron-right-rounded] h-5 w-5" />
          </button>

          {isCreateSubmenuOpen && (
            <>
              <div
                className="absolute top-0 left-full h-full w-2"
                onMouseEnter={openCreateSubmenu}
                onMouseLeave={closeCreateSubmenuWithDelay}
              />
              <div
                className="absolute top-0 left-full z-50 ml-1 w-59 rounded-sm border border-gray-200 bg-white py-1 shadow-lg"
                onMouseEnter={openCreateSubmenu}
                onMouseLeave={closeCreateSubmenuWithDelay}
              >
                <button
                  className="w-full cursor-pointer px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => router.push("/create/general")}
                >
                  Start with blank config
                </button>
                <button
                  className="w-full cursor-pointer px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Start from imported config
                </button>
              </div>
            </>
          )}
        </DropdownItem>
        <DropdownDivider />
        <DropdownHeader className="!px-3 !py-1.5 text-left text-sm text-gray-500">Your campaigns</DropdownHeader>
        {Array.from(campaignList.entries()).map(([id, { name }]) => (
          <DropdownItem
            key={id}
            className={`!px-3 !py-1.5 ${id === selectedCampaignId ? "text-blue-600" : "text-gray-700"}`}
          >
            <Link href={`/campaigns/${id}/`} className={`block h-full w-full rounded-lg text-left`}>
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
            // Validate before navigating so a bad file is reported here, not in the wizard.
            parseExportedCampaignConfig(raw);
            sessionStorage.setItem(process.env.NEXT_PUBLIC_PENDING_IMPORTED_CONFIG_KEY ?? "", raw);
            router.push("/create/general");
          } catch (error) {
            notify.error("Failed to import configuration file.", error instanceof Error ? error.message : "");
          }
          e.target.value = "";
        }}
      />
    </>
  );
};

export default CampaignDropdown;
