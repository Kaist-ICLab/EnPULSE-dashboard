import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import { parseExportedCampaignConfig } from "@/utils/importedConfig";
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
        const parsed = parseExportedCampaignConfig(raw);

        setCampaignUsingImportedConfig(parsed);
        notify.success(
          parsed.campaign_trigger
            ? "Configuration imported"
            : "Configuration imported. It has no triggers, so existing triggers were kept but need their survey selected again.",
        );
      } catch (e) {
        notify.error("Failed to import configuration file.", e instanceof Error ? e.message : "");
      }
    },
    [setCampaignUsingImportedConfig],
  );

  return { importCampaignConfig };
};

export default useImportCampaignConfig;
