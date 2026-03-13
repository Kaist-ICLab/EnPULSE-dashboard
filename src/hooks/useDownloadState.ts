import { useState, useMemo, useCallback, useEffect } from "react";
import { DownloadFileRow } from "@/types/download";
import useCampaign from "./useCampaign";
import { getDownloadData, getDownloadRowCount } from "@/services/downloadService";
import dayjs from "dayjs";
import { ResponseStatus } from "@/types/response";

const MAX_GROUP_BYTES = 200 * 1024 * 1024; // 100MB
const REQUEST_DELAY_MS = 1000;
const GROUP_DOWNLOAD_DELAY_MS = 400;

const sleep = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function useDownloadState() {
    const { campaign, campaignParticipants, campaignTables, campaignTableFields } = useCampaign();

    const [selectedParticipantIds, setSelectedParticipantIds] = useState<string[]>([]);
    const [selectedFieldIds, setSelectedFieldIds] = useState<number[]>([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const [status, setStatus] = useState<ResponseStatus>(null);
    const [downloadFiles, setDownloadFiles] = useState<DownloadFileRow[]>([]);
    const [isDownloadingAll, setIsDownloadingAll] = useState(false);

    const [previewStatus, setPreviewStatus] = useState<ResponseStatus>(null);
    const [selectedPreviewRow, setSelectedPreviewRow] = useState<DownloadFileRow | null>(null);
    const [previewData, setPreviewData] = useState<Record<string, unknown>[]>([]);

    const csvEscape = useCallback((value: string) => {
        if (value.includes(",") || value.includes('"') || value.includes("\n")) {
            return `"${value.replaceAll('"', '""')}"`;
        }
        return value;
    }, []);

    const getFieldsForRow = useCallback((row: DownloadFileRow) => {
        const fieldIdInTable = Array.from(campaignTables.values())
            .filter((table) => table.name === row.table)
            .flatMap((table) => table.campaign_table_field.map((field) => field.id));

        return fieldIdInTable
            .filter((id) => selectedFieldIds.includes(id))
            .map((id) => campaignTableFields.get(id)?.name ?? "")
            .filter((field) => field !== "");
    }, [campaignTables, campaignTableFields, selectedFieldIds]);

    const buildCsvForRow = useCallback(async (row: DownloadFileRow) => {
        const fields = getFieldsForRow(row);
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

        return {
            fileName: `data-${row.table}-${row.uuid}-${dayjs(row.date).format("YYYY-MM-DD")}.csv`,
            csv: [header.join(","), ...body].join("\n"),
        };
    }, [csvEscape, getFieldsForRow]);

    const triggerFileDownload = useCallback((blob: Blob, fileName: string) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
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
        try {
            const { fileName, csv } = await buildCsvForRow(row);
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            triggerFileDownload(blob, fileName);
        } finally {
        }

    }, [buildCsvForRow, triggerFileDownload]);

    const downloadAllData = useCallback(async () => {
        const downloadableRows = downloadFiles.filter((row) => row.count > 0);
        if (downloadableRows.length === 0) return;

        setIsDownloadingAll(true);
        try {
            const JSZip = (await import("jszip")).default;
            const encoder = new TextEncoder();

            let zipGroup: { fileName: string; csv: string }[] = [];
            let zipGroupBytes = 0;
            let zipPart = 1;

            const flushZipGroup = async () => {
                if (zipGroup.length === 0) return;

                const zip = new JSZip();
                zipGroup.forEach((file) => {
                    zip.file(file.fileName, file.csv);
                });

                const zipBlob = await zip.generateAsync({
                    type: "blob",
                    compression: "DEFLATE",
                    compressionOptions: { level: 6 },
                });

                const zipName = `campaign-${campaign?.id ?? "data"}-download-part-${zipPart}.zip`;
                triggerFileDownload(zipBlob, zipName);

                // Release group references so the browser can reclaim memory.
                zipGroup = [];
                zipGroupBytes = 0;
                zipPart += 1;
                await sleep(GROUP_DOWNLOAD_DELAY_MS);
            };

            for (let idx = 0; idx < downloadableRows.length; idx++) {
                const row = downloadableRows[idx];
                const csvFile = await buildCsvForRow(row);
                const csvBytes = encoder.encode(csvFile.csv).length;

                if (zipGroup.length > 0 && zipGroupBytes + csvBytes > MAX_GROUP_BYTES) {
                    await flushZipGroup();
                }

                zipGroup.push(csvFile);
                zipGroupBytes += csvBytes;

                if (idx < downloadableRows.length - 1) {
                    await sleep(REQUEST_DELAY_MS);
                }
            }

            await flushZipGroup();
        } finally {
            setIsDownloadingAll(false);
        }
    }, [buildCsvForRow, campaign?.id, downloadFiles, triggerFileDownload]);

    const generatePreviewData = useCallback(async (row: DownloadFileRow) => {
        setPreviewStatus("loading");
        const fields = getFieldsForRow(row);
        const data = await getDownloadData(row.uuid, fields, row.date, row.table, true);
        setPreviewData(data);
        setSelectedPreviewRow(row);
        setPreviewStatus("ok");
    }, [getFieldsForRow]);

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
        isDownloadingAll,
        previewStatus,
        selectedPreviewRow,
        generateCountPreview,
        generatePreviewData,
        downloadFiles,
        previewData,
        downloadData,
        downloadAllData,
    }
}