"use client";
import { Card, TextInput } from "flowbite-react";
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
        <PasswordForm
          password={campaignPassword}
          setPassword={setCampaignPassword}
          placeholder={isExistingCampaign ? "Leave empty to keep the current password" : undefined}
        />
      </div>
      {/* Shown inline rather than in a hover-only tooltip, so it is visible on touch screens. */}
      <p className="-mt-2 text-xs text-gray-500">
        Participants enter this password to join the campaign.
        {isExistingCampaign && " Leave it empty to keep the current one; a new password applies to new joins."}
      </p>
    </Card>
  );
};

export default CampaignInfoForm;
