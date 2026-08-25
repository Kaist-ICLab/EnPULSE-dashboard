import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import { ExportedCampaignConfig } from "@/stores/campaignConfigEditStore";
import { notify } from "@/utils/notify";
import { useCallback } from "react";

const useImportCampaignConfig = () => {
  const { setCampaignUsingImportedConfig } = useCampaignConfigEdit((state) => state);

  const readFileAsText = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
      reader.onerror = () => reject(reader.error ?? new Error("Failed to read configuration file."));
      reader.readAsText(file);
    });

  const importCampaignConfig = useCallback(
    async (file: File | undefined) => {
      if (!file) return;

      try {
        const raw = await readFileAsText(file);
        const parsed = JSON.parse(raw) as ExportedCampaignConfig;

        setCampaignUsingImportedConfig(parsed);
        notify.success("Configuration imported");
      } catch {
        notify.error("Failed to import configuration file.");
      }
    },
    [setCampaignUsingImportedConfig],
  );

  return { importCampaignConfig };
};

export default useImportCampaignConfig;
