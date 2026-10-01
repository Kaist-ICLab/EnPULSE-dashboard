import { getCampaignDailySummary, getCampaignSurveyDailySummary } from "@/services/chartService";
import { useEffect, useMemo, useState } from "react";
import { useCampaignStore } from "@/providers/CampaignStoreProvider";
import { UserDailyStatData } from "@/types/dashboard";
import { useSectionParamStore } from "@/providers/SectionParamStoreProvider";
import { notify } from "@/utils/notify";

export type DailyStatColumn =
  { kind: "sensor"; id: number; name: string } | { kind: "survey"; id: number; name: string };

export const useUserDailyStat = (initialRowsPerPage: number) => {
  const { date, lastManualSyncTime } = useSectionParamStore((state) => state);
  const { campaign, campaignParticipants, campaignTables } = useCampaignStore((state) => state);

  const [data, setData] = useState<UserDailyStatData[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, _setPage] = useState(1);
  const [rowsPerPage, _setRowsPerPage] = useState(initialRowsPerPage);

  const uuids = useMemo(() => {
    return Array.from(campaignParticipants.values())
      .filter((_, idx) => idx >= (page - 1) * rowsPerPage && idx < page * rowsPerPage)
      .map((p) => p.uuid);
  }, [campaignParticipants, page, rowsPerPage]);

  const tableIds = useMemo(() => {
    return Array.from(campaignTables.values()).map((t) => t.id);
  }, [campaignTables]);

  const surveyIds = useMemo(() => {
    return (campaign?.survey ?? []).map((s) => s.id);
  }, [campaign?.survey]);

  const columns = useMemo((): DailyStatColumn[] => {
    const sensorCols: DailyStatColumn[] = Array.from(campaignTables.values()).map((t) => ({
      kind: "sensor",
      id: t.id,
      name: t.display_name,
    }));
    const surveyCols: DailyStatColumn[] = (campaign?.survey ?? []).map((s) => ({
      kind: "survey",
      id: s.id,
      name: s.title,
    }));
    return [...sensorCols, ...surveyCols];
  }, [campaignTables, campaign?.survey]);

  const totalPage = useMemo(() => {
    // At least one page, so a campaign with no participants shows "Page 1 of 1"
    // instead of "Page 1 of 0" and paging can't reach page 0.
    return Math.max(1, Math.ceil(Array.from(campaignParticipants.values()).length / rowsPerPage));
  }, [campaignParticipants, rowsPerPage]);

  const setPage = (page: number) => {
    if (page < 1) {
      page = 1;
    }
    if (page > totalPage) {
      page = totalPage;
    }

    _setPage(page);
  };

  const setRowsPerPage = (newRowsPerPage: number) => {
    _setRowsPerPage(newRowsPerPage);
    setPage(1);
  };

  // Per-column scales for the two display modes, keyed by `${kind}-${id}` so sensor
  // and survey ids don't collide. They must stay separate: Count mode draws the
  // day's total, Timeline mode draws single 2-hour slots, and a day total is
  // almost always larger than any one slot.
  // - maxDailyCount: largest day total in the column (Count mode). The table's
  //   "Daily Count Threshold" (daily_count_max) overrides it when set.
  // - maxSlotCount: largest single 2-hour slot in the column (Timeline mode).
  const { maxDailyCount, maxSlotCount } = useMemo(() => {
    const daily = new Map<string, number>();
    const slot = new Map<string, number>();

    const addEntry = (key: string, totalCount: number, counts: number[]) => {
      daily.set(key, Math.max(daily.get(key) ?? 0, totalCount));
      slot.set(key, Math.max(slot.get(key) ?? 0, ...counts));
    };

    for (const row of data) {
      for (const table of row.tables) addEntry(`sensor-${table.table_id}`, table.totalCount, table.counts);
      for (const survey of row.surveys) addEntry(`survey-${survey.survey_id}`, survey.totalCount, survey.counts);
    }

    campaignTables.entries().forEach(([tableId, table]) => {
      if (table.daily_count_max > 0) daily.set(`sensor-${tableId}`, table.daily_count_max);
    });

    return { maxDailyCount: daily, maxSlotCount: slot };
  }, [data, campaignTables]);

  useEffect(() => {
    if (uuids.length == 0) return;

    // Set by the cleanup when inputs change before this request finishes,
    // so a slow, older response cannot overwrite a newer one.
    let ignore = false;

    const load = async () => {
      let sensorData: Awaited<ReturnType<typeof getCampaignDailySummary>>;
      let surveyData: Awaited<ReturnType<typeof getCampaignSurveyDailySummary>>;
      try {
        [sensorData, surveyData] = await Promise.all([
          getCampaignDailySummary(uuids, tableIds, date),
          getCampaignSurveyDailySummary(uuids, surveyIds, date),
        ]);
      } catch (e) {
        if (ignore) return;
        setLoading(false);
        notify.error("Failed to load the daily overview", e instanceof Error ? e.message : String(e));
        return;
      }
      if (ignore) return;

      // Merge survey daily summary into the sensor result, keyed by uuid.
      // If a uuid has only survey data (no sensor rows), it won't appear in
      // sensorData — synthesize an empty entry for it.
      const byUuid = new Map(sensorData.map((d) => [d.uuid, d]));
      for (const uuid of uuids) {
        const existing = byUuid.get(uuid);
        const surveys = surveyData.get(uuid) ?? [];
        if (existing) {
          existing.surveys = surveys;
        } else if (surveys.some((s) => s.totalCount > 0)) {
          byUuid.set(uuid, { uuid, contacts: 0, tables: [], surveys });
        }
      }

      setData(Array.from(byUuid.values()));
      setLoading(false);
    };

    setLoading(true);
    load();
    return () => {
      ignore = true;
    };
  }, [date, page, rowsPerPage, totalPage, uuids, lastManualSyncTime, tableIds, surveyIds]);

  return { data, maxDailyCount, maxSlotCount, columns, loading, page, rowsPerPage, totalPage, setPage, setRowsPerPage };
};

export default useUserDailyStat;
