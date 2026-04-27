import useCampaignConfigEdit, { ExportedCampaignConfig } from "../useCampaignConfigEdit";
import { useCallback } from "react";

const useImportCampaignConfig = () => {
    const { setCampaignUsingImportedConfig } = useCampaignConfigEdit();

    const readFileAsText = (file: File) =>
        new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
            reader.onerror = () => reject(reader.error ?? new Error("Failed to read configuration file."));
            reader.readAsText(file);
        });

    const importCampaignConfig = useCallback(async (file: File | undefined) => {
        if (!file) return;

        try {
            const raw = await readFileAsText(file);
            const parsed = JSON.parse(raw) as ExportedCampaignConfig;

            setCampaignUsingImportedConfig(parsed);
        } catch {
            window.alert("Failed to import configuration file.");
        }
    }, [setCampaignUsingImportedConfig]);

    return { importCampaignConfig };
};

export default useImportCampaignConfig;
