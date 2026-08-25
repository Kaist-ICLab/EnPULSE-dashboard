import { getCampaignDailySummary, getCampaignSurveyDailySummary } from "@/services/chartService";
import { useEffect, useMemo, useState } from "react";
import { useCampaignStore } from "@/providers/CampaignStoreProvider";
import { UserDailyStatData } from "@/types/dashboard";
import { useSectionParamStore } from "@/providers/SectionParamStoreProvider";

export type DailyStatColumn =
  { kind: "sensor"; id: number; name: string } | { kind: "survey"; id: number; name: string };

export const useUserDailyStat = (rowsPerPage: number) => {
  const { date, lastManualSyncTime } = useSectionParamStore((state) => state);
  const { campaign, campaignParticipants, campaignTables } = useCampaignStore((state) => state);

  const [data, setData] = useState<UserDailyStatData[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, _setPage] = useState(1);

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

  // `rowsPerPage` follows the window width, so the current page can fall out
  // of range when the table grows; clamp it back into range when it does.
  useEffect(() => {
    if (page > totalPage) _setPage(Math.max(1, totalPage));
  }, [page, totalPage]);

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

    const load = async () => {
      const [sensorData, surveyData] = await Promise.all([
        getCampaignDailySummary(uuids, tableIds, date),
        getCampaignSurveyDailySummary(uuids, surveyIds, date),
      ]);

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
  }, [date, page, rowsPerPage, totalPage, uuids, lastManualSyncTime, tableIds, surveyIds]);

  return { data, maxDailyCount, columns, loading, page, totalPage, setPage };
};

export default useUserDailyStat;
