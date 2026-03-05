"use client";
import CampaignDropdown from "@/components/common/CampaignDropdown";
import React from "react";
import { Button } from "flowbite-react";
import useSectionState from "@/hooks/useSectionState";
import { usePathname } from "next/navigation";
import dayjs from "dayjs";
import useCampaign from "@/hooks/useCampaign";
import useCampaignConfigEdit from "@/hooks/useCampaignConfigEdit";
import { useUpdateCampaign } from "@/hooks/configuration/useUpdateCampaign";
import AddSensorButtons from "@/components/configuration/header/AddSensorButtons";
import AddSurveyButton from "@/components/configuration/header/AddSurveyButton";
import AddQuestionHeader from "@/components/configuration/header/AddQuestionHeader";
import { useTemporalStore } from "@/hooks/useTemporalStore";
import UndoRedoButtons from "../configuration/header/UndoRedoButtons";

const Header: React.FC = () => {
    const { date, updateDate: setDate, addDaysToDate, initTimeRange } = useSectionState();
    const { campaign, fetchCampaigns, selectCampaign } = useCampaign();
    const { pastStates } = useTemporalStore(useCampaignConfigEdit, (state) => state);
    const { updateCampaignConfig } = useUpdateCampaign(async (id) => {
        await fetchCampaigns();
        await selectCampaign(id, true);
    });

    const pathname = usePathname();
    const isSettingsPage = pathname?.includes("/settings") ?? false;

    const isPassiveSensingPage = isSettingsPage && pathname?.includes("/passive-sensing");
    const isActiveSensingPage = isSettingsPage && pathname?.includes("/active-sensing");
    const isQuestionPage = isSettingsPage && !!pathname?.match(/\/active-sensing\/\d+$/);

    return (
        <div className="w-full min-h-16 flex justify-between items-center border-b border-gray-200 px-4">
            <div className="flex justify-start items-center gap-2">
                <div className="py-2 rounded-xl flex justify-center items-center gap-2 text-gray-700 hover:text-gray-500">
                    <CampaignDropdown />
                </div>
            </div>
            {!isSettingsPage && (
                <>
                    <div className="flex items-center gap-1 ml-auto mr-6">
                        <Button
                            color="light"
                            className="px-1"
                            aria-label="Previous day"
                            disabled={(dayjs(date).isBefore(dayjs(campaign?.start_time).endOf('day')))}
                            onClick={() => {
                                addDaysToDate(-1);
                                initTimeRange();
                            }}
                        >
                            <span className="icon-[eva--chevron-left-fill] w-6 h-6"></span>
                        </Button>
                        <input
                            type="date"
                            className="h-10 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2 py-1"
                            value={dayjs(date).format('YYYY-MM-DD')}
                            onChange={(e) => {
                                const date = dayjs(e.target.value).startOf('day').toDate();
                                setDate(date);
                                initTimeRange();
                            }}
                        />
                        <Button
                            color="light"
                            className="px-1"
                            aria-label="Next day"
                            disabled={(dayjs(date).isAfter(dayjs().startOf('day').subtract(1, 'second'))) || (!dayjs(date).isBefore(dayjs(campaign?.end_time).startOf('day')))}
                            onClick={() => {
                                addDaysToDate(1);
                                initTimeRange();
                            }}
                        >
                            <span className="icon-[eva--chevron-right-fill] w-6 h-6"></span>
                        </Button>
                    </div>
                    <Button>
                        <span className="icon-[eva--sync-fill] w-4 h-4 mr-2"></span> Sync now
                    </Button>
                </>
            )}

            {isSettingsPage && (
                <div className="flex items-center gap-4 ml-auto">
                    {isPassiveSensingPage && <AddSensorButtons />}
                    {isActiveSensingPage && !isQuestionPage && <AddSurveyButton />}
                    {isQuestionPage && <AddQuestionHeader />}
                    <div className="pl-4 border-l border-gray-200 flex items-center gap-4">
                        <UndoRedoButtons />
                        <Button color="blue" onClick={updateCampaignConfig} disabled={pastStates.length === 0}>
                            <span className="icon-[material-symbols--save] w-6 h-6 mr-2"></span>Save
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Header;