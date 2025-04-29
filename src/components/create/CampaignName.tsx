'use client'
import { Button, TextInput } from "flowbite-react";
import { checkCampaignNameDuplicate } from "@/services/campaignService";
import { Dispatch, SetStateAction, useState } from "react";

const stateColorMap = {
    "loading": "text-gray-500",
    "ok": "text-green-500",
    "error": "text-red-500",
}

const stateMessageMap = {
    "loading": "Validating...",
    "ok": "Valid name",
    "error": "Invalid name",
}

const CampaignName: React.FC<{
    campaignName: string,
    setCampaignName: Dispatch<SetStateAction<string>>
}> = ({ campaignName, setCampaignName }) => {
    const [status, setStatus] = useState<"loading" | "ok" | "error" | null>(null);
    const [isChanged, setIsChanged] = useState(false);

    return (
        <div role="campaign-name">
            <h6 className="text-xl font-medium text-gray-900 mb-2">
                Campaign name
            </h6>
            <div className="flex gap-2 items-stretch">
                <TextInput
                    type="text"
                    value={campaignName}
                    onChange={(e) => { setCampaignName(e.target.value); setIsChanged(true) }}
                    className="w-[400px]"
                />
                <Button
                    color="gray"
                    disabled={!isChanged}
                    onClick={() => {
                        setStatus("loading");
                        checkCampaignNameDuplicate(campaignName).then((isDuplicate) => {
                            setStatus(isDuplicate ? "error" : "ok");
                            setIsChanged(false);
                        })
                    }}
                    className="text-gray-900 font-medium bg-gray-50 border border-gray-300 hover:bg-gray-100"
                >
                    Validate
                </Button>
            </div>
            {status && <div className={`mt-2 text-sm ${stateColorMap[status]}`}>
                {stateMessageMap[status]}
            </div>}
        </div>
    );
};

export default CampaignName; 