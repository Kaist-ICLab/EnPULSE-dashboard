import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import dayjs from "dayjs";
import { useMemo } from "react";
import { isTriggerComplete } from "@/types/trigger";
import { findTimingSensorTable, getTimingScheduleEntries, getTimingScheduleEntryIssue } from "@/types/timingSchedule";

export function useValidConfigState() {
  const {
    campaignId,
    campaignName,
    campaignPassword,
    campaignStartTime,
    campaignEndTime,
    tables,
    campaign_trigger,
    webapps,
  } = useCampaignConfigEdit((state) => state);

  // A new campaign needs a password so participants can join. For an existing one,
  // an empty field means "keep the current password" (the save only writes
  // credentials when a password is entered).
  const infoIssue = useMemo(() => {
    if (campaignName.trim().length === 0) return "Enter a campaign name.";
    if (campaignId === -1 && campaignPassword.length === 0) {
      return "Set a password. Participants enter it to join the campaign.";
    }
    const start = dayjs(campaignStartTime);
    const end = dayjs(campaignEndTime);
    if (!start.isValid() || !end.isValid()) return "Set both a start time and an end time for the campaign.";
    if (!end.isAfter(start)) return "The campaign end time must be after its start time.";
    return null;
  }, [campaignId, campaignName, campaignPassword, campaignStartTime, campaignEndTime]);
  const isInfoValid = infoIssue === null;

  // A campaign with no timing_sensor row is fine (no schedules configured yet). If one
  // exists, every entry's name must be non-empty/unique and complete for its kind — otherwise
  // authors get silent no-op behavior on device instead of a save-time error.
  const passiveSensingIssue = useMemo(() => {
    const timingTable = findTimingSensorTable(tables);
    if (!timingTable) return null;
    const entries = getTimingScheduleEntries(timingTable);
    const names = entries.map((e) => e.value.trim()).filter((n) => n.length > 0);
    const duplicate = names.find((n, i) => names.indexOf(n) !== i);
    if (duplicate) return `Two timing schedules are named "${duplicate}". Schedule names must be unique.`;
    for (const entry of entries) {
      const issue = getTimingScheduleEntryIssue(entry);
      if (issue) return issue;
    }
    return null;
  }, [tables]);
  const isPassiveSensingValid = passiveSensingIssue === null;

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

  return {
    isInfoValid,
    infoIssue,
    isPassiveSensingValid,
    passiveSensingIssue,
    isActiveSensingValid,
    isWebappValid,
    isTriggerValid,
    isAccessible,
  };
}
