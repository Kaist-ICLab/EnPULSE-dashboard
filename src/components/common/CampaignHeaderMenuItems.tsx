"use client";

import AddQuestionHeader from "@/components/configuration/header/AddQuestionHeader";
import AddSensorButtons from "@/components/configuration/header/AddSensorButtons";
import AddSurveyButton from "@/components/configuration/header/AddSurveyButton";
import AddWebappButton from "@/components/configuration/header/AddWebappButton";
import UndoRedoButtons from "@/components/configuration/header/UndoRedoButtons";
import { useUpdateCampaign } from "@/hooks/configuration/useUpdateCampaign";
import { useValidConfigState } from "@/hooks/configuration/useValidConfigState";
import { useCampaignConfigEdit, useCampaignConfigEditStoreApi } from "@/providers/CampaignConfigEditStoreProvider";
import { type CampaignConfigEditState, getStateFromCampaign } from "@/stores/campaignConfigEditStore";
import { useCampaignListStore } from "@/providers/CampaignListStoreProvider";
import { useCampaignStore } from "@/providers/CampaignStoreProvider";
import { useSectionParamStore } from "@/providers/SectionParamStoreProvider";
import { getCampaignInfo, getCampaignList } from "@/services/campaignService";
import { notify } from "@/utils/notify";
import dayjs from "dayjs";
import { Button, Spinner } from "flowbite-react";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { VALIDATION_MESSAGES } from "@/constants/validationMessages";

export const DashboardHeaderMenuItems: React.FC = () => {
  const { date, updateDate, addDaysToDate, initTimeRange, setLastManualSyncTime } = useSectionParamStore(
    (state) => state,
  );
  const { campaign, setCampaign } = useCampaignStore((state) => state);
  const [isSyncing, setIsSyncing] = useState(false);

  // The campaign (participants, sensors) is loaded once with the page. Reload it too,
  // otherwise a phone that joined after the page opened only appears after a hard reload.
  const syncNow = async () => {
    setIsSyncing(true);
    try {
      if (campaign?.id !== undefined) setCampaign(await getCampaignInfo(campaign.id));
    } catch {
      notify.error("Failed to reload the campaign.");
    } finally {
      setLastManualSyncTime(Date.now());
      setIsSyncing(false);
    }
  };

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
      <Button onClick={syncNow} disabled={isSyncing}>
        <span className="icon-[eva--sync-fill] mr-2 h-4 w-4"></span> {isSyncing ? "Syncing..." : "Sync now"}
      </Button>
    </>
  );
};

// The parts of the edit state that a save writes. Comparing this against the last saved
// version decides whether Save is enabled, instead of "is there undo history" (history is
// cleared on every Settings tab switch, see below).
const serializeSavedConfig = (state: CampaignConfigEditState): string =>
  JSON.stringify(
    sortListsById([
      state.campaignName,
      state.campaignDescription,
      state.campaignStartTime,
      state.campaignEndTime,
      state.campaignPassword,
      state.tables,
      state.surveys,
      state.campaign_trigger,
      state.webapps,
    ]),
  );

// Embedded lists (sensors, surveys, triggers, ...) may come back from the database in a
// different order on each read, so compare them sorted by id. Question order is still
// compared, because it is stored in each question's config (see campaignService).
function sortListsById(value: unknown): unknown {
  if (Array.isArray(value)) {
    const items = value.map(sortListsById);
    const allHaveIds = items.every((v) => typeof (v as { id?: unknown } | null)?.id === "number");
    return allHaveIds ? items.sort((a, b) => (a as { id: number }).id - (b as { id: number }).id) : items;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, sortListsById(v)]));
  }
  return value;
}

export const SettingsHeaderMenuItems: React.FC = () => {
  const { setCampaignList } = useCampaignListStore((state) => state);
  const { setCampaign } = useCampaignStore((state) => state);
  const configEditStore = useCampaignConfigEditStoreApi();
  const currentConfig = useCampaignConfigEdit(serializeSavedConfig);
  const [savedConfig, setSavedConfig] = useState(() => serializeSavedConfig(configEditStore.getState()));
  const hasUnsavedChanges = currentConfig !== savedConfig;
  const { isInfoValid, isPassiveSensingValid, isActiveSensingValid, isWebappValid, isTriggerValid } = useValidConfigState();
  // Set when the post-save reload fails: the edit store then still holds the
  // pre-save rows (new rows without ids), so another save would insert them twice.
  const [needsReload, setNeedsReload] = useState(false);
  const [isCheckingConflict, setIsCheckingConflict] = useState(false);
  const { isUpdating, updateCampaignConfig } = useUpdateCampaign(async (id) => {
    try {
      const campaignList = await getCampaignList();
      const currentCampaign = await getCampaignInfo(id);
      setCampaignList(campaignList);
      setCampaign(currentCampaign);
      configEditStore.getState().resetFromCampaign(currentCampaign);
      configEditStore.temporal.getState().clear();
      setSavedConfig(serializeSavedConfig(configEditStore.getState()));
    } catch {
      setNeedsReload(true);
      notify.error(
        "Saved, but failed to reload the campaign",
        "Reload the page before making more changes, otherwise new items may be saved twice.",
      );
    }
  });

  // Two tabs (or two people) editing the same campaign: the last save used to win silently,
  // and a tab still holding a deleted row re-created it. There is no updated_at column, so
  // compare the database's current version with the one this tab loaded or last saved.
  const saveIfUnchangedElsewhere = async () => {
    setIsCheckingConflict(true);
    try {
      const latest = await getCampaignInfo(configEditStore.getState().campaignId);
      if (serializeSavedConfig(getStateFromCampaign(latest)) !== savedConfig) {
        setNeedsReload(true);
        notify.error(
          "This campaign was changed elsewhere",
          "Another tab or person saved changes after you opened this page. Reload the page to see them, then redo your edits.",
        );
        return;
      }
    } catch (error) {
      notify.error("Failed to save campaign", error instanceof Error ? error.message : "Unknown error");
      return;
    } finally {
      setIsCheckingConflict(false);
    }
    updateCampaignConfig();
  };

  const pathname = usePathname();
  // Settings tabs share one edit store, so undo used to reach back into another tab and
  // change it out of sight (e.g. Ctrl+Z on Triggers undoing an edit made on General).
  // Scope undo to the tab being viewed by starting fresh history on every tab change.
  useEffect(() => {
    configEditStore.temporal.getState().clear();
  }, [pathname, configEditStore]);
  const isPassiveSensingPage = pathname?.includes("/passive-sensing");
  const isActiveSensingPage = pathname?.includes("/active-sensing");
  const isQuestionPage = !!pathname?.match(/\/active-sensing\/\d+$/);
  const isWebappPage = pathname?.includes("/webapp");

  let disabledReason = "";
  if (needsReload) {
    disabledReason = "Reload the page before saving again.";
  } else if (!isInfoValid || !isPassiveSensingValid || !isActiveSensingValid || !isWebappValid || !isTriggerValid) {
    disabledReason = VALIDATION_MESSAGES.FIX_ISSUES_TOOLTIP;
  } else if (!hasUnsavedChanges) {
    disabledReason = VALIDATION_MESSAGES.NO_CHANGES;
  }

  const isSaveDisabled = disabledReason !== "" || isUpdating || isCheckingConflict;

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
            onClick={saveIfUnchangedElsewhere}
            disabled={isSaveDisabled}
          >
            {isUpdating || isCheckingConflict ? (
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
