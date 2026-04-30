"use client"

import AddQuestionHeader from "@/components/configuration/header/AddQuestionHeader";
import AddSensorButtons from "@/components/configuration/header/AddSensorButtons";
import AddSurveyButton from "@/components/configuration/header/AddSurveyButton";
import UndoRedoButtons from "@/components/configuration/header/UndoRedoButtons";
import { useUpdateCampaign } from "@/hooks/configuration/useUpdateCampaign";
import { useTemporalStore } from "@/hooks/useTemporalStore";
import { useCampaignConfigEditStoreApi } from "@/providers/CampaignConfigEditStoreProvider";
import { useCampaignListStore } from "@/providers/CampaignListStoreProvider";
import { useCampaignStore } from "@/providers/CampaignStoreProvider";
import { useSectionParamStore } from "@/providers/SectionParamStoreProvider";
import { getCampaignInfo, getCampaignList } from "@/services/campaignService";
import { notify } from "@/utils/notify";
import dayjs from "dayjs";
import { Button, Spinner } from "flowbite-react";
import { usePathname } from "next/navigation";
import React from "react";

export const DashboardHeaderMenuItems: React.FC = () => {
    const { date, updateDate, addDaysToDate, initTimeRange, setLastManualSyncTime } = useSectionParamStore((state) => state);
    const { campaign } = useCampaignStore((state) => state);

    return (
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
                    className="h-10 w-32 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2 py-1"
                    value={dayjs(date).format('YYYY-MM-DD')}
                    min={dayjs(campaign?.start_time).format('YYYY-MM-DD')}
                    max={dayjs(campaign?.end_time).format('YYYY-MM-DD')}
                    onChange={(e) => {
                        const date = dayjs(e.target.value).startOf('day').toDate();
                        updateDate(date);
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
            <Button onClick={() => setLastManualSyncTime(Date.now())}>
                <span className="icon-[eva--sync-fill] w-4 h-4 mr-2"></span> Sync now
            </Button>
        </>
    );
}

export const SettingsHeaderMenuItems: React.FC = () => {
    const { setCampaignList } = useCampaignListStore((state) => state);
    const { setCampaign } = useCampaignStore((state) => state);
    const configEditStore = useCampaignConfigEditStoreApi();
    const { pastStates } = useTemporalStore(configEditStore, (state) => state);
    const { isUpdating, updateCampaignConfig } = useUpdateCampaign(async (id) => {
        try {
            const campaignList = await getCampaignList();
            const currentCampaign = await getCampaignInfo(id);
            setCampaignList(campaignList);
            setCampaign(currentCampaign);
        } catch {
            notify.error("Failed to refresh campaign data after save.");
        }
    });

    const pathname = usePathname();
    const isPassiveSensingPage = pathname?.includes("/passive-sensing");
    const isActiveSensingPage = pathname?.includes("/active-sensing");
    const isQuestionPage = !!pathname?.match(/\/active-sensing\/\d+$/);

    return (<div className="flex items-center gap-4 ml-auto">
        {isPassiveSensingPage && <AddSensorButtons />}
        {isActiveSensingPage && !isQuestionPage && <AddSurveyButton />}
        {isQuestionPage && <AddQuestionHeader />}
        <div className="pl-4 border-l border-gray-200 flex items-center gap-4">
            <UndoRedoButtons />
            <Button color="blue" onClick={updateCampaignConfig} disabled={pastStates.length === 0 || isUpdating}>
                {isUpdating ? <><Spinner size="sm" className="mr-2" /> Saving...</> : <><span className="icon-[material-symbols--save] w-6 h-6 mr-2"></span>Save</>}
            </Button>
        </div>
    </div>
    );
}