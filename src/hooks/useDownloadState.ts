import { useState, useMemo, useCallback, useEffect } from "react";
import { DownloadFileRow } from "@/types/download";
import useCampaign from "./useCampaign";
import { getDownloadData, getDownloadRowCount } from "@/services/downloadService";
import dayjs from "dayjs";
import { ResponseStatus } from "@/types/response";

export default function useDownloadState() {
    const { campaign, campaignParticipants, campaignTables, campaignTableFields } = useCampaign();

    const [selectedParticipantIds, setSelectedParticipantIds] = useState<string[]>([]);
    const [selectedFieldIds, setSelectedFieldIds] = useState<number[]>([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const [status, setStatus] = useState<ResponseStatus>(null);
    const [downloadFiles, setDownloadFiles] = useState<DownloadFileRow[]>([]);

    const [previewStatus, setPreviewStatus] = useState<ResponseStatus>(null);
    const [selectedPreviewRow, setSelectedPreviewRow] = useState<DownloadFileRow | null>(null);
    const [previewData, setPreviewData] = useState<Record<string, unknown>[]>([]);

    const csvEscape = useCallback((value: string) => {
        if (value.includes(",") || value.includes('"') || value.includes("\n")) {
            return `"${value.replaceAll('"', '""')}"`;
        }
        return value;
    }, []);

    useEffect(() => {
        if (!campaign) return;
        setStartDate(dayjs(campaign.start_time).toDate());

        const campaignEndDate = dayjs(campaign.end_time).toDate();
        const today = new Date();

        setEndDate(campaignEndDate < today ? campaignEndDate : today);
    }, [campaign, setStartDate, setEndDate]);


    const selectedTableIds = useMemo(() => {
        return (
            Array.from(campaignTables.values()).filter((table) => {
                return table.campaign_table_field.filter(field => selectedFieldIds.includes(field.id)).length > 0;
            }).map(table => table.id)
        );
    }, [selectedFieldIds, campaignTables]);

    const generateCountPreview = useCallback(async () => {
        const tables = selectedTableIds.map(id => campaignTables.get(id)?.name ?? "");
        setDownloadFiles([]);
        setStatus("loading");
        const rowCounts = await getDownloadRowCount(selectedParticipantIds, startDate, endDate, tables);
        setDownloadFiles(rowCounts.map(row => ({
            table: row.table,
            uuid: row.uuid,
            email: campaignParticipants.get(row.uuid)?.email ?? "",
            date: row.date,
            count: row.count,
        })));
        setStatus("ok");
    }, [selectedParticipantIds, startDate, endDate, selectedTableIds, campaignTables, campaignParticipants]);

    const downloadData = useCallback(async (row: DownloadFileRow) => {
        const fieldIdInTable = Array.from(campaignTables.values()).filter(table => table.name === row.table).flatMap(table => table.campaign_table_field.map(field => field.id));
        const fields = fieldIdInTable.filter(id => selectedFieldIds.includes(id)).map(id => campaignTableFields.get(id)?.name ?? "");
        try {
            const data = await getDownloadData(row.uuid, fields, row.date, row.table) as Record<string, unknown>[];

            const header = ["uuid", "timestamp", ...fields];
            const body = data.map((item) => {
                const values = [
                    String(item.uuid ?? ""),
                    String(item.timestamp ?? ""),
                    ...fields.map((field) => String(item[field] ?? "")),
                ];
                return values.map(csvEscape).join(",");
            });

            const csv = [header.join(","), ...body].join("\n");
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `data-${row.table}-${row.uuid}-${dayjs(row.date).format("YYYY-MM-DD")}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } finally {
        }

    }, [campaignTables, campaignTableFields, selectedFieldIds, csvEscape]);

    const generatePreviewData = useCallback(async (row: DownloadFileRow) => {
        setPreviewStatus("loading");
        const fieldIdInTable = Array.from(campaignTables.values()).filter(table => table.name === row.table).flatMap(table => table.campaign_table_field.map(field => field.id));
        const fields = fieldIdInTable.filter(id => selectedFieldIds.includes(id)).map(id => campaignTableFields.get(id)?.name ?? "");
        const data = await getDownloadData(row.uuid, fields, row.date, row.table, true);
        setPreviewData(data);
        setSelectedPreviewRow(row);
        setPreviewStatus("ok");
    }, [selectedFieldIds, campaignTableFields, campaignTables]);

    return {
        selectedParticipantIds,
        setSelectedParticipantIds,
        selectedFieldIds,
        setSelectedFieldIds,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        status,
        previewStatus,
        selectedPreviewRow,
        generateCountPreview,
        generatePreviewData,
        downloadFiles,
        previewData,
        downloadData,
    }
}