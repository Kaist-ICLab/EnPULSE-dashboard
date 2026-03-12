import { useState, useMemo, useCallback } from "react";
import { DownloadFileRow } from "@/types/download";
import useCampaign from "./useCampaign";
import { getDownloadRowCount } from "@/services/downloadService";

export default function useDownloadState() {
    const { campaignParticipants, campaignTables } = useCampaign();

    const [selectedParticipantIds, setSelectedParticipantIds] = useState<string[]>([]);
    const [selectedFieldIds, setSelectedFieldIds] = useState<number[]>([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    // const [isDownloading, setIsDownloading] = useState(false);
    // const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [previewRows, setPreviewRows] = useState<DownloadFileRow[]>([]);

    const selectedTableIds = useMemo(() => {
        return (
            Array.from(campaignTables.values()).filter((table) => {
                return table.campaign_table_field.filter(field => selectedFieldIds.includes(field.id)).length > 0;
            }).map(table => table.id)
        );
    }, [selectedFieldIds, campaignTables]);

    const generateCountPreview = useCallback(async () => {
        const tables = selectedTableIds.map(id => campaignTables.get(id)?.name ?? "");
        const rowCounts = await getDownloadRowCount(selectedParticipantIds, startDate, endDate, tables);
        setPreviewRows(rowCounts.map(row => ({
            table: row.table,
            uuid: row.uuid,
            email: campaignParticipants.get(row.uuid)?.email ?? "",
            date: row.date,
            count: row.count,
        })));
    }, [selectedParticipantIds, startDate, endDate, selectedTableIds, campaignTables, campaignParticipants]);

    return {
        selectedParticipantIds,
        setSelectedParticipantIds,
        selectedFieldIds,
        setSelectedFieldIds,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        generateCountPreview,
        previewRows,
    }
}