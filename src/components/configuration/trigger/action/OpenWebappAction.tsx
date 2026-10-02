"use client";

import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import { DeviceType } from "@/types/survey";
import { TriggerAction } from "@/types/trigger";
import { Select } from "flowbite-react";
import MinIntervalInput from "./MinIntervalInput";

// Picker-backed editor for the "open_webapp" action — persists as a Broadcast action with the
// well-known OPEN_WEBAPP action string and survey_id/webapp_id extras (see persistAction in
// types/trigger.ts), so researchers never have to type either id by hand.
const OpenWebappAction: React.FC<{
  action: Extract<TriggerAction, { kind: "open_webapp" }>;
  onChange: (next: TriggerAction) => void;
}> = ({ action, onChange }) => {
  const { surveys, webapps } = useCampaignConfigEdit((state) => state);
  // The phone opens the web app via its own WebAppActivity; there is no watch equivalent.
  const eligibleSurveys = surveys.map((s, idx) => ({ s, idx })).filter(({ s }) => s.device_type === DeviceType.Phone);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <Select
          sizing="md"
          value={action.surveyIndex}
          onChange={(e) => onChange({ ...action, surveyIndex: Number(e.target.value) })}
        >
          <option value={-1}>Select a survey…</option>
          {eligibleSurveys.map(({ s, idx }) => (
            <option key={idx} value={idx}>
              {s.title || `Survey ${idx + 1}`}
            </option>
          ))}
        </Select>
        {eligibleSurveys.length === 0 && <p className="text-xs text-red-600">No Phone surveys configured.</p>}
      </div>

      <div className="flex flex-col gap-1">
        <Select
          sizing="md"
          value={action.webappIndex}
          onChange={(e) => onChange({ ...action, webappIndex: Number(e.target.value) })}
        >
          <option value={-1}>Select a web app…</option>
          {webapps.map((w, idx) => (
            <option key={idx} value={idx}>
              {w.name || `Web App ${idx + 1}`}
            </option>
          ))}
        </Select>
        {webapps.length === 0 && (
          <p className="text-xs text-red-600">No web app is configured. Add one under Web App.</p>
        )}
      </div>

      <MinIntervalInput
        label="Minimum Interval Between Launches:"
        value={action.minIntervalMillis}
        onChange={(minIntervalMillis) => onChange({ ...action, minIntervalMillis })}
      />
    </div>
  );
};

export default OpenWebappAction;
