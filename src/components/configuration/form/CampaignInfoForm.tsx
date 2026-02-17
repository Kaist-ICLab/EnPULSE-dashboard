'use client'
import { Button, Card, TextInput, Tooltip } from "flowbite-react";
import useCampaignConfigEdit from "@/hooks/useCampaignConfigEdit";
import dayjs from "dayjs";
import useCampaignNameState from "@/hooks/configuration/useCampaignNameState";
import PasswordForm from "./PasswordForm";

const stateMessageMap = {
    "loading": "Validating...",
    "ok": "Valid",
    "error": "Invalid",
}

const classMap = {
    "loading": "bg-gray-100",
    "ok": "bg-green-500 hover:bg-green-600",
    "error": "bg-red-500 hover:bg-red-600",
}

const CampaignInfoForm = () => {
    const {
        campaignStartTime,
        campaignEndTime,
        setCampaignStartTime,
        setCampaignEndTime,
        campaignDescription,
        setCampaignDescription,
        campaignPassword,
        setCampaignPassword
    } = useCampaignConfigEdit();
    const { campaignName, setCampaignName, status, isChanged, checkIsValidName } = useCampaignNameState();

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
                        onChange={(e) => setCampaignName(e.target.value)}
                        className="grow"
                    />
                    {(status && !isChanged) ? (
                        <Button
                            className={`${classMap[status]} text-white cursor-default`}
                        >
                            {stateMessageMap[status]}
                        </Button>) :
                        <Button
                            color="gray"
                            disabled={!isChanged}
                            onClick={() => checkIsValidName()}
                            className="text-gray-900 font-medium bg-gray-50 border border-gray-300 hover:bg-gray-100"
                        >
                            Validate
                        </Button>}
                </div>
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
                    <PasswordForm password={campaignPassword} setPassword={setCampaignPassword} />
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