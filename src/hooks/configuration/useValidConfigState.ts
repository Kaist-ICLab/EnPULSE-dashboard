import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import dayjs from "dayjs";
import { useMemo } from "react";
import { getTriggerIssue } from "@/types/trigger";
import { DeviceType, SurveyQuestion } from "@/types/survey";
import { MIN_WATCH_SURVEY_EXPIRE_MS, getNumberScaleIssue } from "@/constants/survey";
import {
  findTimingSensorTable,
  getTimingScheduleEntries,
  getTimingScheduleEntryIssue,
  getTimingScheduleValues,
} from "@/types/timingSchedule";

export function useValidConfigState() {
  const {
    campaignId,
    campaignName,
    campaignPassword,
    campaignStartTime,
    campaignEndTime,
    tables,
    surveys,
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
  // Watch surveys do need a usable expiration: the DB defaults expire_after_ms to 0, which
  // makes the watch's countdown skip entirely, so the microEMA closes before it is shown.
  const activeSensingIssue = useMemo(() => {
    const tooShort = surveys.find(
      (s) =>
        s.device_type === DeviceType.Watch && (!s.expire_after_ms || s.expire_after_ms < MIN_WATCH_SURVEY_EXPIRE_MS),
    );
    if (tooShort) {
      return `Watch survey "${tooShort.title || "Untitled"}" needs an expiration time of at least ${MIN_WATCH_SURVEY_EXPIRE_MS} ms.`;
    }

    // A survey with no questions opens and closes immediately on the watch, and shows only a
    // Submit button on the phone.
    const empty = surveys.find((s) => s.survey_question.length === 0);
    if (empty) return `Survey "${empty.title || "Untitled"}" has no questions. Add at least one.`;

    // Number-scale ranges and choice options, at every nesting level (follow-ups included).
    const findScaleIssue = (questions: SurveyQuestion[]): string | null => {
      for (const q of questions) {
        if (q.answer_type === "radio" || q.answer_type === "checkbox") {
          const options = ((q.config ?? {}) as { options?: string[] }).options ?? [];
          if (options.filter((o) => o.trim().length > 0).length === 0) {
            return `Question "${q.question || "Untitled"}" has no options to choose from. Add at least one.`;
          }
        }
        if (q.answer_type === "numberscale") {
          const config = (q.config ?? {}) as { min?: number; max?: number };
          const issue = getNumberScaleIssue(config.min ?? 0, config.max ?? 10);
          if (issue) return `Question "${q.question || "Untitled"}": ${issue}`;
        }
        for (const t of q.survey_question_trigger) {
          const nested = findScaleIssue(t.survey_question);
          if (nested) return nested;
        }
      }
      return null;
    };
    for (const s of surveys) {
      const issue = findScaleIssue(s.survey_question);
      if (issue) return issue;
    }
    return null;
  }, [surveys]);
  const isActiveSensingValid = activeSensingIssue === null;

  const isWebappValid = useMemo(() => {
    return webapps.every((webapp) => !!webapp.icon_path);
  }, [webapps]);

  const triggerIssue = useMemo(() => {
    const context = {
      timingScheduleValues: getTimingScheduleValues(tables),
      campaignTableNames: new Set(tables.map((t) => t.name)),
      surveys,
    };
    for (const [i, t] of campaign_trigger.entries()) {
      const issue = getTriggerIssue(t, i, context);
      if (issue) return issue;
    }
    return null;
  }, [campaign_trigger, tables, surveys]);
  const isTriggerValid = triggerIssue === null;

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
    activeSensingIssue,
    isWebappValid,
    isTriggerValid,
    triggerIssue,
    isAccessible,
  };
}
