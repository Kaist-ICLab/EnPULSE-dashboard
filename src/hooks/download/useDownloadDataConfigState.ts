import { useCampaignStore } from "@/providers/CampaignStoreProvider";
import { getDownloadRowCount } from "@/services/downloadService";
import { notify } from "@/utils/notify";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import useDownloadState from "../../stores/downloadStore";

export default function useDownloadDataConfigState() {
  const { campaign, campaignParticipants, campaignTables } = useCampaignStore((state) => state);
  const { selectedFieldIds, selectedParticipantIds, setDownloadListStatus, setDownloadList } = useDownloadState();

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    if (!campaign) return;
    setStartDate(dayjs(campaign.start_time).toDate());

    const campaignEndDate = dayjs(campaign.end_time).toDate();
    const today = new Date();

    setEndDate(campaignEndDate < today ? campaignEndDate : today);
  }, [campaign, setStartDate, setEndDate]);

  const selectedTableIds = useMemo(() => {
    return Array.from(campaignTables.values())
      .filter((table) => {
        return table.campaign_table_field.filter((field) => selectedFieldIds.includes(field.id)).length > 0;
      })
      .map((table) => table.id);
  }, [selectedFieldIds, campaignTables]);

  const generateDownloadList = useCallback(async () => {
    const tables = selectedTableIds.map((id) => campaignTables.get(id)?.name ?? "");
    setDownloadList([]);
    setDownloadListStatus("loading");
    try {
      const rowCounts = await getDownloadRowCount(selectedParticipantIds, startDate, endDate, tables);
      setDownloadList(
        rowCounts.map((row) => ({
          isChecked: false,
          downloadStatus: null,
          table: row.table,
          uuid: row.uuid,
          pid: campaignParticipants.get(row.uuid)?.pid ?? 0,
          date: row.date,
          count: row.count,
        })),
      );
      setDownloadListStatus("ok");
    } catch (error) {
      notify.error("Failed to load download list", error instanceof Error ? error.message : "Unknown error");
      setDownloadListStatus("error");
    }
  }, [
    selectedParticipantIds,
    startDate,
    endDate,
    selectedTableIds,
    campaignTables,
    campaignParticipants,
    setDownloadListStatus,
    setDownloadList,
  ]);

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    generateDownloadList,
  };
}
