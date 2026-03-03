import useCampaignConfigEdit from "../useCampaignConfigEdit";
import { useCallback } from "react";
import dayjs from "dayjs";
import { DATE_FORMAT } from "@/utils/date";

type FileWriter = {
    write: (data: Blob) => Promise<void>;
    close: () => Promise<void>;
};
type FileHandle = { createWritable: () => Promise<FileWriter> };
type SaveFilePickerWindow = Window & {
    showSaveFilePicker?: (options?: {
        suggestedName?: string;
        types?: Array<{ description?: string; accept: Record<string, string[]> }>;
    }) => Promise<FileHandle>;
};

const setAllIdFieldsToMinusOne = <T,>(value: T): T => {
    if (Array.isArray(value)) {
        return value.map((item) => setAllIdFieldsToMinusOne(item)) as T;
    }
    if (value && typeof value === "object") {
        const transformed = Object.entries(value as Record<string, unknown>).reduce<Record<string, unknown>>((acc, [key, nestedValue]) => {
            if (key === "id" || key.endsWith("_id")) {
                acc[key] = -1;
                return acc;
            }
            acc[key] = setAllIdFieldsToMinusOne(nestedValue);
            return acc;
        }, {});
        return transformed as T;
    }
    return value;
};

const getSuggestedFileName = (campaignName: string) => {
    const normalized = campaignName
        .trim()
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase() || "campaign"
    return `${normalized}-config-${dayjs().format(DATE_FORMAT)}.json`;
};

const useExportCampaignConfig = () => {
    const { campaignName, tables, surveys } = useCampaignConfigEdit();

    const exportCampaignConfig = useCallback(async () => {
        const configToExport = {
            tables,
            surveys,
        };
        const normalizedConfigToExport = setAllIdFieldsToMinusOne(configToExport);

        const blob = new Blob([JSON.stringify(normalizedConfigToExport, null, 2)], {
            type: "application/json",
        });

        const suggestedName = getSuggestedFileName(campaignName);
        const triggerBrowserDownload = () => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = suggestedName;
            link.style.display = "none";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            // Some browsers need the blob URL to remain valid briefly.
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        };

        const saveWindow = window as SaveFilePickerWindow;
        if (saveWindow.showSaveFilePicker && window.isSecureContext) {
            try {
                const handle = await saveWindow.showSaveFilePicker({
                    suggestedName,
                    types: [
                        {
                            description: "JSON files",
                            accept: { "application/json": [".json"] },
                        },
                    ],
                });
                const writable = await handle.createWritable();
                await writable.write(blob);
                await writable.close();
                return;
            } catch (error) {
                // User canceled the picker.
                if (error instanceof DOMException && error.name === "AbortError") return;
            }
        }

        triggerBrowserDownload();
    }, [campaignName, tables, surveys]);

    return { exportCampaignConfig };
};

export default useExportCampaignConfig;
