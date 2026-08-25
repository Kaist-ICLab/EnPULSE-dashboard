"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import AddSensorButtons from "@/components/configuration/header/AddSensorButtons";
import AddSurveyButton from "@/components/configuration/header/AddSurveyButton";
import AddWebappButton from "@/components/configuration/header/AddWebappButton";
import Link from "next/link";
import AddQuestionHeader from "../configuration/header/AddQuestionHeader";
import { Button, Dropdown, DropdownItem } from "flowbite-react";
import UndoRedoButtons from "../configuration/header/UndoRedoButtons";

const CampaignCreateHeader: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isMainCampaignPage = pathname === "/campaigns";
  const isPassiveSensingPage = pathname.includes("/passive-sensing");
  const isActiveSensingPage = pathname.includes("/active-sensing");
  const isQuestionPage = pathname.match(/\/active-sensing\/\d+$/) !== null;
  const isWebappPage = pathname.includes("/webapp");

  return (
    <div className="relative flex min-h-14 w-full items-center border-b border-gray-200 bg-gray-50 px-4">
      <div className="flex flex-col items-start p-2">
        <Link href="/">
          <div className="text-3xl font-bold">EnPULSE</div>
        </Link>
        <div className="text-xs/3 font-light">
          Enabling Platform for User Logging <br /> and Sensing Environment
        </div>
      </div>
      <div className="flex grow justify-end">
        {isMainCampaignPage && (
          <>
            <Dropdown
              dismissOnClick={true}
              placement="bottom-end"
              renderTrigger={() => (
                <Button>
                  <span className="icon-[tabler--plus] mr-2"></span> Create Campaign
                </Button>
              )}
            >
              <DropdownItem onClick={() => router.push("/create/general")}>Start with blank config</DropdownItem>
              <DropdownItem onClick={() => fileInputRef.current?.click()}>Start from imported config</DropdownItem>
            </Dropdown>
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
        )}
        {isPassiveSensingPage && <AddSensorButtons />}
        {isActiveSensingPage && !isQuestionPage && <AddSurveyButton />}
        {isQuestionPage && <AddQuestionHeader />}
        {isWebappPage && <AddWebappButton />}
        {!isMainCampaignPage && (
          <div className="ml-4 flex items-center border-l border-gray-200 py-4 pl-4">
            <UndoRedoButtons />
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignCreateHeader;
