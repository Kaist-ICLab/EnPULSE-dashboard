import { getDownloadData } from "@/services/downloadService";
import { DownloadFileRow } from "@/types/download";
import { ResponseStatus } from "@/types/response";
import { useCallback, useMemo, useState } from "react";
import { useCampaignStore } from "@/providers/CampaignStoreProvider";
import useDownloadState from "../../stores/downloadStore";
import { notify } from "@/utils/notify";
import dayjs from "dayjs";

const MAX_GROUP_BYTES = 200 * 1024 * 1024; // 100MB
const REQUEST_DELAY_MS = 500;
const GROUP_DOWNLOAD_DELAY_MS = 200;

const sleep = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


export default function useDownloadListState() {
    const { campaign, campaignTables, campaignTableFields } = useCampaignStore((state) => state);
    const { downloadList, selectedFieldIds, setDownloadListItemStatus, setAllDownloadListItemsStatus } = useDownloadState();

    const [previewStatus, setPreviewStatus] = useState<ResponseStatus>(null);
    const [previewData, setPreviewData] = useState<Record<string, unknown>[]>([]);
    const [selectedPreviewRow, setSelectedPreviewRow] = useState<DownloadFileRow | null>(null);

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

    const downloadAndBuildFile = useCallback(async (idx: number, row: DownloadFileRow) => {
        const fields = getFieldsForRow(row);

        setDownloadListItemStatus(idx, "loading");
        const data = await getDownloadData(row.uuid, fields, row.date, row.table) as Record<string, unknown>[];
        setDownloadListItemStatus(idx, "ok");

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
    }, [csvEscape, getFieldsForRow, setDownloadListItemStatus]);

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

    const downloadData = useCallback(async (idx: number, row: DownloadFileRow) => {
        try {
            const { fileName, csv } = await downloadAndBuildFile(idx, row);
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            triggerFileDownload(blob, fileName);
        } catch (error) {
            notify.error("Failed to download data", error instanceof Error ? error.message : "Unknown error");
        } finally {
            setDownloadListItemStatus(idx, null);
        }

    }, [downloadAndBuildFile, triggerFileDownload, setDownloadListItemStatus]);

    const downloadAllData = useCallback(async () => {
        downloadList.forEach((row, idx) => row.isChecked && setDownloadListItemStatus(idx, "loading"));
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

            for (let idx = 0; idx < downloadList.length; idx++) {
                const row = downloadList[idx];
                if (!row.isChecked || row.count === 0) continue;

                const csvFile = await downloadAndBuildFile(idx, row);
                const csvBytes = encoder.encode(csvFile.csv).length;

                if (zipGroup.length > 0 && zipGroupBytes + csvBytes > MAX_GROUP_BYTES) {
                    await flushZipGroup();
                }

                zipGroup.push(csvFile);
                zipGroupBytes += csvBytes;

                if (idx < downloadList.length - 1) {
                    await sleep(REQUEST_DELAY_MS);
                }
            }

            await flushZipGroup();
            notify.success("Download ready");
        } catch (error) {
            notify.error("Failed to download data", error instanceof Error ? error.message : "Unknown error");
        } finally {
            setAllDownloadListItemsStatus(null);
        }
    }, [downloadAndBuildFile, campaign?.id, downloadList, triggerFileDownload, setDownloadListItemStatus, setAllDownloadListItemsStatus]);

    const isSomethingDownloading = useMemo(() => {
        return downloadList.some((row) => row.downloadStatus === "loading");
    }, [downloadList]);

    const generatePreviewData = useCallback(async (row: DownloadFileRow) => {
        setPreviewStatus("loading");
        const fields = getFieldsForRow(row);
        try {
            const data = await getDownloadData(row.uuid, fields, row.date, row.table, true);
            setPreviewData(data);
            setSelectedPreviewRow(row);
            setPreviewStatus("ok");
        } catch (error) {
            notify.error("Failed to load preview", error instanceof Error ? error.message : "Unknown error");
            setPreviewStatus("error");
        }
    }, [getFieldsForRow]);

    const selectedDataCount = useMemo(() => {
        return downloadList.filter((row) => row.isChecked).length;
    }, [downloadList]);

    return {
        selectedPreviewRow,
        previewStatus,
        previewData,
        selectedDataCount,
        isSomethingDownloading,
        generatePreviewData,
        downloadData,
        downloadAllData,
    }
}