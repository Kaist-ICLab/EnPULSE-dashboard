"use client";

import AddQuestionHeader from "@/components/configuration/header/AddQuestionHeader";
import AddSensorButtons from "@/components/configuration/header/AddSensorButtons";
import AddSurveyButton from "@/components/configuration/header/AddSurveyButton";
import AddWebappButton from "@/components/configuration/header/AddWebappButton";
import UndoRedoButtons from "@/components/configuration/header/UndoRedoButtons";
import { useUpdateCampaign } from "@/hooks/configuration/useUpdateCampaign";
import { useValidConfigState } from "@/hooks/configuration/useValidConfigState";
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
import React, { useState } from "react";
import { VALIDATION_MESSAGES } from "@/constants/validationMessages";

export const DashboardHeaderMenuItems: React.FC = () => {
  const { date, updateDate, addDaysToDate, initTimeRange, setLastManualSyncTime } = useSectionParamStore(
    (state) => state,
  );
  const { campaign } = useCampaignStore((state) => state);

  return (
    <>
      <div className="mr-6 ml-auto flex items-center gap-1">
        <Button
          color="light"
          className="px-1"
          aria-label="Previous day"
          disabled={dayjs(date).isBefore(dayjs(campaign?.start_time).endOf("day"))}
          onClick={() => {
            addDaysToDate(-1);
            initTimeRange();
          }}
        >
          <span className="icon-[eva--chevron-left-fill] h-6 w-6"></span>
        </Button>
        <input
          type="date"
          className="block h-10 w-32 rounded-lg border border-gray-300 bg-white px-2 py-1 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          value={dayjs(date).format("YYYY-MM-DD")}
          min={dayjs(campaign?.start_time).format("YYYY-MM-DD")}
          max={dayjs(campaign?.end_time).format("YYYY-MM-DD")}
          onChange={(e) => {
            const date = dayjs(e.target.value).startOf("day").toDate();
            updateDate(date);
            initTimeRange();
          }}
        />
        <Button
          color="light"
          className="px-1"
          aria-label="Next day"
          disabled={
            dayjs(date).isAfter(dayjs().startOf("day").subtract(1, "second")) ||
            !dayjs(date).isBefore(dayjs(campaign?.end_time).startOf("day"))
          }
          onClick={() => {
            addDaysToDate(1);
            initTimeRange();
          }}
        >
          <span className="icon-[eva--chevron-right-fill] h-6 w-6"></span>
        </Button>
      </div>
      <Button onClick={() => setLastManualSyncTime(Date.now())}>
        <span className="icon-[eva--sync-fill] mr-2 h-4 w-4"></span> Sync now
      </Button>
    </>
  );
};

export const SettingsHeaderMenuItems: React.FC = () => {
  const { setCampaignList } = useCampaignListStore((state) => state);
  const { setCampaign } = useCampaignStore((state) => state);
  const configEditStore = useCampaignConfigEditStoreApi();
  const { pastStates } = useTemporalStore(configEditStore, (state) => state);
  const { isInfoValid, isPassiveSensingValid, isActiveSensingValid, isWebappValid, isTriggerValid } = useValidConfigState();
  // Set when the post-save reload fails: the edit store then still holds the
  // pre-save rows (new rows without ids), so another save would insert them twice.
  const [needsReload, setNeedsReload] = useState(false);
  const { isUpdating, updateCampaignConfig } = useUpdateCampaign(async (id) => {
    try {
      const campaignList = await getCampaignList();
      const currentCampaign = await getCampaignInfo(id);
      setCampaignList(campaignList);
      setCampaign(currentCampaign);
      configEditStore.getState().resetFromCampaign(currentCampaign);
      configEditStore.temporal.getState().clear();
    } catch {
      setNeedsReload(true);
      notify.error(
        "Saved, but failed to reload the campaign",
        "Reload the page before making more changes, otherwise new items may be saved twice.",
      );
    }
  });

  const pathname = usePathname();
  const isPassiveSensingPage = pathname?.includes("/passive-sensing");
  const isActiveSensingPage = pathname?.includes("/active-sensing");
  const isQuestionPage = !!pathname?.match(/\/active-sensing\/\d+$/);
  const isWebappPage = pathname?.includes("/webapp");

  let disabledReason = "";
  if (needsReload) {
    disabledReason = "Reload the page before saving again.";
  } else if (!isInfoValid || !isPassiveSensingValid || !isActiveSensingValid || !isWebappValid || !isTriggerValid) {
    disabledReason = VALIDATION_MESSAGES.FIX_ISSUES_TOOLTIP;
  } else if (pastStates.length === 0) {
    disabledReason = VALIDATION_MESSAGES.NO_CHANGES;
  }

  const isSaveDisabled = disabledReason !== "" || isUpdating;

  return (
    <div className="ml-auto flex items-center gap-4">
      {isPassiveSensingPage && <AddSensorButtons />}
      {isActiveSensingPage && !isQuestionPage && <AddSurveyButton />}
      {isQuestionPage && <AddQuestionHeader />}
      {isWebappPage && <AddWebappButton />}
      <div className="flex items-center gap-4 border-l border-gray-200 pl-4">
        <UndoRedoButtons />
        <div className="inline-block" title={disabledReason}>
          <Button
            color="blue"
            onClick={updateCampaignConfig}
            disabled={isSaveDisabled}
          >
            {isUpdating ? (
              <>
                <Spinner size="sm" className="mr-2" /> Saving...
              </>
            ) : (
              <>
                <span className="icon-[material-symbols--save] mr-2 h-6 w-6"></span>Save
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
