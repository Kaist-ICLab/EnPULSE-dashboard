"use client";
import React from "react";
import { usePathname } from "next/navigation";
import AddSensorButtons from "@/components/configuration/header/AddSensorButtons";
import AddSurveyButton from "@/components/configuration/header/AddSurveyButton";
import Link from "next/link";
import AddQuestionHeader from "../configuration/header/AddQuestionHeader";
import { Button } from "flowbite-react";

const CampaignCreateHeader: React.FC = () => {
    const pathname = usePathname();

    const isMainCampaignPage = pathname === "/campaigns";
    const isPassiveSensingPage = pathname.includes('/passive-sensing');
    const isActiveSensingPage = pathname.includes('/active-sensing');
    const isQuestionPage = pathname.match(/\/active-sensing\/\d+$/) !== null;

    return (
        <div className="w-full min-h-14 flex items-center border-b border-gray-200 px-4 relative bg-gray-50">

            <div className="p-2 flex flex-col items-start">
                <Link href="/">
                    <div className="text-3xl font-bold">EnPULSE</div>
                </Link>
                <div className="text-xs/3 font-light">Enabling Platform for User Logging <br /> and Sensing Environment</div>
            </div>
            <div className="grow flex justify-end">
                {isMainCampaignPage && <Link href="/create">
                    <Button>
                        <span className="icon-[tabler--plus] mr-2"></span> Create Campaign
                    </Button>
                </Link>}
                {isPassiveSensingPage && <AddSensorButtons />}
                {isActiveSensingPage && !isQuestionPage && <AddSurveyButton />}
                {isQuestionPage && <AddQuestionHeader />}
            </div>
        </div>
    );
}

export default CampaignCreateHeader;