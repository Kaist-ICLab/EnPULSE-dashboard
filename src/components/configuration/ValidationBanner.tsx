"use client";

import { useValidConfigState } from "@/hooks/configuration/useValidConfigState";
import { Alert } from "flowbite-react";
import { VALIDATION_MESSAGES } from "@/constants/validationMessages";

export const ValidationBanner: React.FC = () => {
  const {
    isInfoValid,
    infoIssue,
    isPassiveSensingValid,
    passiveSensingIssue,
    isActiveSensingValid,
    isWebappValid,
    isTriggerValid,
  } = useValidConfigState();

  const issues: string[] = [];
  if (!isInfoValid) issues.push(infoIssue ?? VALIDATION_MESSAGES.INFO_INVALID);
  if (!isPassiveSensingValid) issues.push(passiveSensingIssue ?? VALIDATION_MESSAGES.PASSIVE_SENSING_INVALID);
  if (!isActiveSensingValid) issues.push(VALIDATION_MESSAGES.ACTIVE_SENSING_INVALID);
  if (!isWebappValid) issues.push(VALIDATION_MESSAGES.WEBAPP_INVALID);
  if (!isTriggerValid) issues.push(VALIDATION_MESSAGES.TRIGGER_INVALID);

  if (issues.length === 0) return null;

  return (
    <div className="w-full px-4 pt-4 shrink-0">
      <Alert color="failure" icon={() => <span className="icon-[mdi--alert-circle] mr-3 h-5 w-5" />}>
        <div className="flex flex-col">
          <span className="font-medium text-sm mb-1">{VALIDATION_MESSAGES.FIX_ISSUES_PROMPT}</span>
          <ul className="list-disc pl-5 text-sm">
            {issues.map((issue, idx) => (
              <li key={idx}>{issue}</li>
            ))}
          </ul>
        </div>
      </Alert>
    </div>
  );
};
