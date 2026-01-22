"use client";
import React from "react";
import { usePathname } from "next/navigation";
import AddSensorButtons from "./AddSensorButtons";
import AddSurveyButton from "./AddSurveyButton";
import SurveyQuestionHeader from "./SurveyQuestionHeader";

const CampaignCreateHeader: React.FC = () => {
    const pathname = usePathname();

    const getPageTitle = () => {
        if (pathname.includes('/name')) return "Campaign Information";
        if (pathname.includes('/active-sensing')) return "Active Sensing";
        if (pathname.includes('/passive-sensing')) {
            // Check if we're on a question editing page
            if (pathname.match(/\/passive-sensing\/\d+$/)) {
                return "Survey Questions for";
            }
            return "Passive Sensing";
        }
        return "Create Campaign";
    };

    const isActiveSensingPage = pathname.includes('/active-sensing');
    const isPassiveSensingPage = pathname.includes('/passive-sensing');
    const isQuestionPage = pathname.match(/\/passive-sensing\/\d+$/) !== null;

    return (
        <div className="w-full min-h-16 flex items-center border-b border-gray-200 px-6 relative">
            <h2 className="text-xl font-bold text-gray-900 mr-4">Configure {getPageTitle()}</h2>
            <div className="grow flex justify-end">
                {isActiveSensingPage && <AddSensorButtons />}
                {isPassiveSensingPage && !isQuestionPage && <AddSurveyButton />}
                {isQuestionPage && <SurveyQuestionHeader />}
            </div>
        </div>
    );
}

export default CampaignCreateHeader;