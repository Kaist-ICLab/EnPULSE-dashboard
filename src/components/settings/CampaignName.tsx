'use client'
import { Button, Spinner, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import useCampaign from "@/hooks/useCampaign";

const stateColorMap = {
    "loading": "text-gray-500",
    "ok": "text-green-500",
    "error": "text-red-500",
}

const CampaignName = () => {
    const { responses, selectedCampaignId, updateCampaignName, campaignList } = useCampaign();
    const [campaignName, setCampaignName] = useState("");
    useEffect(() => {
        if (selectedCampaignId !== null) {
            setCampaignName(campaignList.get(selectedCampaignId!)?.name || "");
        }
    }, [selectedCampaignId, campaignList]);

    if (selectedCampaignId === null) {
        return <Spinner />;
    }

    const currentCampaignName = campaignList.get(selectedCampaignId)?.name || "";

    return (
        <div role="campaign-name">
            <h6 className="text-base font-medium text-gray-900 mb-2">
                Campaign name
            </h6>
            <div className="flex gap-2 items-stretch">
                <TextInput
                    type="text"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    className="w-[400px]"
                />
                <Button
                    color="gray"
                    disabled={campaignName === currentCampaignName || responses.updateCampaignName.status === "loading"}
                    onClick={() => {
                        updateCampaignName(selectedCampaignId!, campaignName)
                    }}
                    className="text-gray-900 font-medium bg-gray-50 border border-gray-300 hover:bg-gray-100"
                >
                    Rename
                </Button>
            </div>
            {responses.updateCampaignName.status === "loading" && <div className={`mt-2 text-sm ${stateColorMap[responses.updateCampaignName.status]}`}>
                {responses.updateCampaignName.message}
            </div>}
        </div>
    );
};

export default CampaignName; 