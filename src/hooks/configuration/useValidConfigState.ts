import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import { useMemo } from "react";
import { isTriggerComplete } from "@/types/trigger";
import { findTimingSensorTable, getTimingScheduleEntries, isTimingScheduleEntryComplete } from "@/types/timingSchedule";

export function useValidConfigState() {
  const { campaignId, campaignName, campaignPassword, tables, campaign_trigger, webapps } = useCampaignConfigEdit(
    (state) => state,
  );

  // A new campaign needs a password so participants can join. For an existing one,
  // an empty field means "keep the current password" (the save only writes
  // credentials when a password is entered).
  const isInfoValid = useMemo(() => {
    const isNewCampaign = campaignId === -1;
    return campaignName.trim().length > 0 && (!isNewCampaign || campaignPassword.length > 0);
  }, [campaignId, campaignName, campaignPassword]);

  // A campaign with no timing_sensor row is fine (no schedules configured yet). If one
  // exists, every entry's name must be non-empty/unique and complete for its kind — otherwise
  // authors get silent no-op behavior on device instead of a save-time error.
  const isPassiveSensingValid = useMemo(() => {
    const timingTable = findTimingSensorTable(tables);
    if (!timingTable) return true;
    const entries = getTimingScheduleEntries(timingTable);
    const names = entries.map((e) => e.value.trim());
    const hasEmpty = names.some((n) => n.length === 0);
    const hasDuplicates = new Set(names).size !== names.length;
    return !hasEmpty && !hasDuplicates && entries.every(isTimingScheduleEntryComplete);
  }, [tables]);

  // A survey with no linked timing trigger is a legal end state (equivalent to "manual"/no
  // automatic gate) — the guided "Schedule a Survey" flow nudges authors, but doesn't block.
  const isActiveSensingValid = true;

  const isWebappValid = useMemo(() => {
    return webapps.every((webapp) => !!webapp.icon_path);
  }, [webapps]);

  const isTriggerValid = useMemo(() => {
    return campaign_trigger.every(isTriggerComplete);
  }, [campaign_trigger]);

  const isAccessible = useMemo(() => {
    const isAccessible = [true];
    for (const isValid of [isInfoValid, isPassiveSensingValid, isActiveSensingValid, isWebappValid, isTriggerValid]) {
      isAccessible.push(isAccessible[isAccessible.length - 1] && isValid);
    }

    return isAccessible;
  }, [isInfoValid, isPassiveSensingValid, isActiveSensingValid, isWebappValid, isTriggerValid]);

  return { isInfoValid, isPassiveSensingValid, isActiveSensingValid, isWebappValid, isTriggerValid, isAccessible };
}
