'use client'
import { Button, Card, TextInput, Tooltip } from "flowbite-react";
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
        setCampaignDescription,
        campaignPassword,
        setCampaignPassword
    } = useCampaignConfigEdit();
    const [status, setStatus] = useState<"loading" | "ok" | "error" | null>(null);
    const [isChanged, setIsChanged] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex flex-col gap-4">
            <Card>
                <h6 className="text-xl font-medium text-gray-900">
                    Basic Information
                </h6>
                <div className="flex items-center gap-2">
                    <label htmlFor="campaignName" className="block text-sm font-medium text-gray-900">Name</label>
                    <TextInput
                        id="campaignName"
                        type="text"
                        value={campaignName}
                        onChange={(e) => { setCampaignName(e.target.value); setIsChanged(true); setIsValidName(false) }}
                        className="grow"
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
                <div className="flex items-center gap-2">
                    <label htmlFor="camapginPassword" className="block text-sm font-medium text-gray-900">Password</label>
                    <Tooltip content={<div>
                        <p>
                            The password is used to authenticate the user when they access the campaign.
                        </p>
                    </div>} trigger="hover" placement="bottom">
                        <button className="text-gray-500">
                            <span className="mt-1 w-6 h-6 icon-[mingcute--question-fill]"></span>
                        </button>
                    </Tooltip>
                    <div className="relative w-full">
                        <TextInput
                            id="campaignPassword"
                            type={showPassword ? "text" : "password"}
                            value={campaignPassword}
                            onChange={(e) => setCampaignPassword(e.target.value)}
                            className="grow pr-10"
                        />
                        <button
                            type="button"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            className="absolute inset-y-0 right-0 flex items-center px-2 focus:outline-none"
                            onClick={() => setShowPassword((v) => !v)}
                            tabIndex={-1}
                        >
                            <span className={`${showPassword ? "icon-[mdi--eye-off]" : "icon-[mdi--eye]"} text-gray-500 w-5 h-5`} />
                        </button>
                    </div>
                </div>
            </Card>
            <Card>
                <h6 className="text-xl font-medium text-gray-900">
                    Campaign Period
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
        </div >
    );
};

export default CampaignInfoForm; 