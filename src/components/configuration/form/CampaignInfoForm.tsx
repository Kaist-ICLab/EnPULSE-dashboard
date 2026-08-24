"use client";
import { Button, Card, TextInput, Tooltip } from "flowbite-react";
import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import useCampaignNameState from "@/hooks/configuration/useCampaignNameState";
import PasswordForm from "./PasswordForm";

const stateMessageMap = {
  loading: "Validating...",
  ok: "Valid",
  error: "Invalid",
};

const classMap = {
  loading: "bg-gray-100",
  ok: "bg-green-500 hover:bg-green-600",
  error: "bg-red-500 hover:bg-red-600",
};

const CampaignInfoForm = () => {
  const { campaignDescription, setCampaignDescription, campaignPassword, setCampaignPassword } = useCampaignConfigEdit(
    (state) => state,
  );
  const { campaignName, setCampaignName, status, isChanged, checkIsValidName } = useCampaignNameState();

  return (
    <Card>
      <h6 className="text-xl font-medium text-gray-900">Basic Information</h6>
      <div className="flex items-center gap-2">
        <label htmlFor="campaignName" className="block text-sm font-medium text-gray-900">
          Name
        </label>
        <TextInput
          id="campaignName"
          type="text"
          value={campaignName ?? ""}
          onChange={(e) => setCampaignName(e.target.value)}
          className="grow"
        />
        {status && !isChanged ? (
          <Button className={`${classMap[status]} cursor-default text-white`}>{stateMessageMap[status]}</Button>
        ) : (
          <Button
            color="gray"
            disabled={!isChanged}
            onClick={() => checkIsValidName()}
            className="border border-gray-300 bg-gray-50 font-medium text-gray-900 hover:bg-gray-100"
          >
            Validate
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="campaignDescription" className="block text-sm font-medium text-gray-900">
          Description
        </label>
        <TextInput
          id="campaignDescription"
          type="text"
          value={campaignDescription ?? ""}
          onChange={(e) => {
            setCampaignDescription(e.target.value);
          }}
          className="grow"
        />
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="camapginPassword" className="block text-sm font-medium text-gray-900">
          Password
        </label>
        <Tooltip
          content={
            <div>
              <p>The password is used to authenticate the user when they access the campaign.</p>
            </div>
          }
          trigger="hover"
          placement="bottom"
        >
          <button className="text-gray-500">
            <span className="icon-[mingcute--question-fill] mt-1 h-6 w-6"></span>
          </button>
        </Tooltip>
        <PasswordForm password={campaignPassword} setPassword={setCampaignPassword} />
      </div>
    </Card>
  );
};

export default CampaignInfoForm;
