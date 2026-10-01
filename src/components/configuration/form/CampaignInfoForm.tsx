"use client";
import { Card, TextInput, Tooltip } from "flowbite-react";
import { useEffect } from "react";
import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import useCampaignNameState, { CampaignNameStatus } from "@/hooks/configuration/useCampaignNameState";
import PasswordForm from "./PasswordForm";

const nameStatusDisplay: Record<CampaignNameStatus, { text: string; className: string } | null> = {
  empty: null,
  checking: { text: "Checking...", className: "text-gray-500" },
  available: { text: "Available", className: "text-green-600" },
  taken: { text: "Already used by another campaign", className: "text-red-600" },
  unknown: { text: "Could not check this name", className: "text-amber-600" },
};

const CampaignInfoForm: React.FC<{
  onNameStatusChange?: (status: CampaignNameStatus) => void;
}> = ({ onNameStatusChange }) => {
  const { campaignId, campaignDescription, setCampaignDescription, campaignPassword, setCampaignPassword } =
    useCampaignConfigEdit((state) => state);
  const isExistingCampaign = campaignId !== -1;
  const { campaignName, setCampaignName, status } = useCampaignNameState();
  const statusDisplay = nameStatusDisplay[status];

  useEffect(() => {
    onNameStatusChange?.(status);
  }, [status, onNameStatusChange]);

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
          color={status === "taken" ? "failure" : undefined}
        />
        {statusDisplay && (
          <span className={`shrink-0 text-sm font-medium ${statusDisplay.className}`} aria-live="polite">
            {statusDisplay.text}
          </span>
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
        <label htmlFor="campaignPassword" className="block text-sm font-medium text-gray-900">
          Password
        </label>
        <Tooltip
          content={
            <div>
              <p>The password is used to authenticate the user when they access the campaign.</p>
              {isExistingCampaign && (
                <p>Leave it empty to keep the current password. Entering a new one changes it for new joins.</p>
              )}
            </div>
          }
          trigger="hover"
          placement="bottom"
        >
          <button className="text-gray-500">
            <span className="icon-[mingcute--question-fill] mt-1 h-6 w-6"></span>
          </button>
        </Tooltip>
        <PasswordForm
          password={campaignPassword}
          setPassword={setCampaignPassword}
          placeholder={isExistingCampaign ? "Leave empty to keep the current password" : undefined}
        />
      </div>
    </Card>
  );
};

export default CampaignInfoForm;
