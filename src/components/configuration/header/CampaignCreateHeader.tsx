"use client";
import React from "react";
import { usePathname } from "next/navigation";
import AddSensorButtons from "@/components/configuration/header/AddSensorButtons";
import AddSurveyButton from "@/components/configuration/header/AddSurveyButton";
import SurveyQuestionHeader from "./SurveyQuestionHeader";
import MainHeader from "@/components/common/MainHeader";

const CampaignCreateHeader: React.FC = () => {
    const pathname = usePathname();

    const getPageTitle = () => {
        if (pathname.includes('/name')) return "Configure Campaign Information";
        if (pathname.includes('/passive-sensing')) return "Configure Passive Sensing";
        if (pathname.includes('/active-sensing')) {
            // Check if we're on a question editing page
            if (pathname.match(/\/active-sensing\/\d+$/)) {
                return "Configure Questions for";
            }
            return "Configure Active Sensing";
        }
        if (pathname.includes('/confirm')) return "Confirm Configuration";
        return "Create Campaign";
    };

    const isPassiveSensingPage = pathname.includes('/passive-sensing');
    const isActiveSensingPage = pathname.includes('/active-sensing');
    const isQuestionPage = pathname.match(/\/active-sensing\/\d+$/) !== null;

    return (
        <div className="w-full min-h-14 flex items-center border-b border-gray-200 px-6 relative bg-gray-50">

            <MainHeader />
            <div className="grow flex justify-end">
                {isPassiveSensingPage && <AddSensorButtons />}
                {isActiveSensingPage && !isQuestionPage && <AddSurveyButton />}
                {isQuestionPage && <SurveyQuestionHeader />}
            </div>
        </div>
    );
}

export default CampaignCreateHeader;