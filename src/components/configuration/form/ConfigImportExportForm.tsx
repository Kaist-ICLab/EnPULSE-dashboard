import { Button, Card } from "flowbite-react";
import useExportCampaignConfig from "@/hooks/configuration/useExportCampaignConfig";
import useImportCampaignConfig from "@/hooks/configuration/useImportCampaignConfig";
import { useRef } from "react";

const ConfigImportExportForm = () => {
    const { exportCampaignConfig } = useExportCampaignConfig();
    const { importCampaignConfig } = useImportCampaignConfig();
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <Card>
            <h6 className="text-xl font-medium text-gray-900">
                Import/Export Configuration
            </h6>
            <Button color="white" className="max-w-64 border border-gray-300 focus:ring-gray-300! focus:border-gray-400!" onClick={exportCampaignConfig}>
                <span className="icon-[clarity--export-solid] w-6 h-6 mr-2"></span> Export Configuration
            </Button>
            <Button color="white" className="max-w-64 border border-gray-300 focus:ring-gray-300! focus:border-gray-400!" onClick={() => fileInputRef.current?.click()}>
                <span className="icon-[clarity--import-solid] w-6 h-6 mr-2"></span> Import Configuration
            </Button>
            <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={(e) => {
                    void importCampaignConfig(e.target.files?.[0]);
                    e.target.value = "";
                }}
            />
        </Card>
    )
}

export default ConfigImportExportForm;