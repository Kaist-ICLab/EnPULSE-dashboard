'use client'
import { Button, Card, TextInput } from "flowbite-react";
import { checkCampaignNameValidity } from "@/services/campaignService";
import { Dispatch, SetStateAction, useState } from "react";
import useCampaignConfigEdit from "@/hooks/useCampaignConfigEdit";
import dayjs from "dayjs";

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

const CampaignInfoForm: React.FC<{
    campaignName: string,
    setCampaignName: Dispatch<SetStateAction<string>>,
    setIsValidName: Dispatch<SetStateAction<boolean>>,
}> = ({ campaignName, setCampaignName, setIsValidName }) => {
    const {
        setCampaignName: setCampaignNameInHook,
        campaignStartTime,
        campaignEndTime,
        setCampaignStartTime,
        setCampaignEndTime,
        campaignDescription,
        setCampaignDescription
    } = useCampaignConfigEdit();
    const [status, setStatus] = useState<"loading" | "ok" | "error" | null>(null);
    const [isChanged, setIsChanged] = useState(false);

    return (
        <>
            <Card className="mb-4">
                <h6 className="text-xl font-medium text-gray-900">
                    Campaign name
                </h6>
                <div className="flex items-center gap-2">
                    <label htmlFor="campaignName" className="block text-sm font-medium text-gray-900">Name</label>
                    <TextInput
                        id="campaignName"
                        type="text"
                        value={campaignName}
                        onChange={(e) => { setCampaignName(e.target.value); setIsChanged(true); setIsValidName(false) }}
                        className="w-[400px]"
                    />
                    <Button
                        color="gray"
                        disabled={!isChanged}
                        onClick={() => {
                            setStatus("loading");
                            checkCampaignNameValidity(campaignName).then((isValid) => {
                                setStatus(isValid ? "ok" : "error");
                                setIsValidName(isValid)
                                setIsChanged(false);
                                if (isValid) {
                                    setCampaignNameInHook(campaignName);
                                }
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
                <div className="flex items-center gap-2">
                    <label htmlFor="campaignDescription" className="block text-sm font-medium text-gray-900">Description</label>
                    <TextInput
                        id="campaignDescription"
                        type="text"
                        value={campaignDescription}
                        onChange={(e) => { setCampaignDescription(e.target.value); }}
                        className="grow"
                    />
                </div>
            </Card>
            <Card>
                <h6 className="text-xl font-medium text-gray-900">
                    Campaign time
                </h6>
                <div className="flex flex-col gap-2 items-stretch">
                    <div className="flex gap-2 items-center">
                        <label htmlFor="campaignStartTime" className="block text-sm font-medium text-gray-900 w-16">Start time</label>
                        <TextInput
                            type="datetime-local"
                            value={dayjs(campaignStartTime).format("YYYY-MM-DDTHH:mm:ss")}
                            onChange={(e) => setCampaignStartTime(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 items-center">
                        <label htmlFor="campaignEndTime" className="block text-sm font-medium text-gray-900 w-16">End time</label>
                        <TextInput
                            type="datetime-local"
                            value={dayjs(campaignEndTime).format("YYYY-MM-DDTHH:mm:ss")}
                            onChange={(e) => setCampaignEndTime(e.target.value)}
                        />
                    </div>
                </div>
            </Card>
        </>
    );
};

export default CampaignInfoForm; 