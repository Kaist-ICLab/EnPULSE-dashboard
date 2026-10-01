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
    return Math.ceil(Array.from(campaignParticipants.values()).length / rowsPerPage);
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

  // Per-column maximum daily count, used to scale the bar/timeline cells.
  // Keyed by `${kind}-${id}` so sensor and survey ids don't collide.
  const maxDailyCount = useMemo(() => {
    const res = new Map<string, number>();

    for (const row of data) {
      for (const table of row.tables) {
        const key = `sensor-${table.table_id}`;
        const rowMax = table.counts.reduce((acc, count) => Math.max(acc, count), 0);
        res.set(key, Math.max(res.get(key) ?? 0, rowMax));
      }
      for (const survey of row.surveys) {
        const key = `survey-${survey.survey_id}`;
        const rowMax = survey.counts.reduce((acc, count) => Math.max(acc, count), 0);
        res.set(key, Math.max(res.get(key) ?? 0, rowMax));
      }
    }

    campaignTables.entries().forEach(([tableId, table]) => {
      if (table.daily_count_max > 0) res.set(`sensor-${tableId}`, table.daily_count_max);
    });

    return res;
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

  return { data, maxDailyCount, columns, loading, page, rowsPerPage, totalPage, setPage, setRowsPerPage };
};

export default useUserDailyStat;
